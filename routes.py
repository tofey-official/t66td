from flask import render_template, request, jsonify, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from models import SocialUser, AdminUser
from datetime import datetime
import logging

@app.route('/')
def index():
    """Main page displaying all social media users"""
    # Get all non-expired users
    current_time = datetime.utcnow()
    users = SocialUser.query.filter(SocialUser.expires_at > current_time).order_by(SocialUser.added_at.desc()).all()
    
    # Separate by platform
    instagram_users = [user for user in users if user.platform == 'instagram']
    tiktok_users = [user for user in users if user.platform == 'tiktok']
    
    return render_template('index.html', 
                         instagram_users=instagram_users, 
                         tiktok_users=tiktok_users,
                         total_users=len(users))

@app.route('/instagram')
def add_instagram_user():
    """API endpoint to add Instagram user"""
    username = request.args.get('username')
    
    if not username:
        return jsonify({'error': 'Username is required', 'message': 'اسم المستخدم مطلوب'}), 400
    
    # Check if user already exists and not expired
    existing_user = SocialUser.query.filter_by(
        username=username, 
        platform='instagram'
    ).filter(SocialUser.expires_at > datetime.utcnow()).first()
    
    if existing_user:
        return jsonify({
            'error': 'User already exists', 
            'message': f'المستخدم {username} موجود بالفعل',
            'time_remaining': existing_user.time_remaining
        }), 409
    
    try:
        # Remove any expired entries for this user
        SocialUser.query.filter_by(username=username, platform='instagram').filter(
            SocialUser.expires_at <= datetime.utcnow()
        ).delete()
        
        # Add new user
        new_user = SocialUser(username=username, platform='instagram')
        db.session.add(new_user)
        db.session.commit()
        
        logging.info(f"Added Instagram user: {username}")
        
        return jsonify({
            'success': True,
            'message': f'تم إضافة {username} بنجاح على Instagram',
            'user': new_user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error adding Instagram user {username}: {str(e)}")
        return jsonify({'error': 'Database error', 'message': 'خطأ في قاعدة البيانات'}), 500

@app.route('/tiktok')
def add_tiktok_user():
    """API endpoint to add TikTok user"""
    username = request.args.get('username')
    
    if not username:
        return jsonify({'error': 'Username is required', 'message': 'اسم المستخدم مطلوب'}), 400
    
    # Check if user already exists and not expired
    existing_user = SocialUser.query.filter_by(
        username=username, 
        platform='tiktok'
    ).filter(SocialUser.expires_at > datetime.utcnow()).first()
    
    if existing_user:
        return jsonify({
            'error': 'User already exists', 
            'message': f'المستخدم {username} موجود بالفعل',
            'time_remaining': existing_user.time_remaining
        }), 409
    
    try:
        # Remove any expired entries for this user
        SocialUser.query.filter_by(username=username, platform='tiktok').filter(
            SocialUser.expires_at <= datetime.utcnow()
        ).delete()
        
        # Add new user
        new_user = SocialUser(username=username, platform='tiktok')
        db.session.add(new_user)
        db.session.commit()
        
        logging.info(f"Added TikTok user: {username}")
        
        return jsonify({
            'success': True,
            'message': f'تم إضافة {username} بنجاح على TikTok',
            'user': new_user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error adding TikTok user {username}: {str(e)}")
        return jsonify({'error': 'Database error', 'message': 'خطأ في قاعدة البيانات'}), 500

@app.route('/secret-admin-panel-tofi-2024')
def admin_login():
    """Admin login page - secret URL"""
    if 'admin_logged_in' in session:
        return redirect(url_for('admin_dashboard'))
    return render_template('admin.html', login_page=True)

@app.route('/admin/login', methods=['POST'])
def admin_login_post():
    """Handle admin login"""
    username = request.form.get('username')
    password = request.form.get('password')
    
    # Default admin credentials (in production, create proper admin user)
    if username == 'admin' and password == 'sharohat_tofi_2024':
        session['admin_logged_in'] = True
        flash('تم تسجيل الدخول بنجاح', 'success')
        return redirect(url_for('admin_dashboard'))
    
    flash('اسم المستخدم أو كلمة المرور غير صحيحة', 'error')
    return redirect(url_for('admin_login'))

@app.route('/admin/dashboard')
def admin_dashboard():
    """Admin dashboard"""
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))
    
    # Get statistics
    current_time = datetime.utcnow()
    total_users = SocialUser.query.filter(SocialUser.expires_at > current_time).count()
    instagram_count = SocialUser.query.filter(
        SocialUser.platform == 'instagram',
        SocialUser.expires_at > current_time
    ).count()
    tiktok_count = SocialUser.query.filter(
        SocialUser.platform == 'tiktok',
        SocialUser.expires_at > current_time
    ).count()
    
    # Get all users
    all_users = SocialUser.query.filter(
        SocialUser.expires_at > current_time
    ).order_by(SocialUser.added_at.desc()).all()
    
    return render_template('admin.html', 
                         dashboard=True,
                         total_users=total_users,
                         instagram_count=instagram_count,
                         tiktok_count=tiktok_count,
                         users=all_users)

@app.route('/admin/delete/<int:user_id>')
def admin_delete_user(user_id):
    """Delete user from admin panel"""
    if 'admin_logged_in' not in session:
        return redirect(url_for('admin_login'))
    
    user = SocialUser.query.get_or_404(user_id)
    username = user.username
    platform = user.platform
    
    try:
        db.session.delete(user)
        db.session.commit()
        flash(f'تم حذف {username} من {platform} بنجاح', 'success')
    except Exception as e:
        db.session.rollback()
        flash('خطأ في حذف المستخدم', 'error')
        logging.error(f"Error deleting user {user_id}: {str(e)}")
    
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/logout')
def admin_logout():
    """Admin logout"""
    session.pop('admin_logged_in', None)
    flash('تم تسجيل الخروج بنجاح', 'success')
    return redirect(url_for('index'))

@app.route('/api/stats')
def api_stats():
    """API endpoint for statistics"""
    current_time = datetime.utcnow()
    
    stats = {
        'total_users': SocialUser.query.filter(SocialUser.expires_at > current_time).count(),
        'instagram_count': SocialUser.query.filter(
            SocialUser.platform == 'instagram',
            SocialUser.expires_at > current_time
        ).count(),
        'tiktok_count': SocialUser.query.filter(
            SocialUser.platform == 'tiktok',
            SocialUser.expires_at > current_time
        ).count(),
        'expired_users': SocialUser.query.filter(SocialUser.expires_at <= current_time).count()
    }
    
    return jsonify(stats)
