from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import logging
from app import app, db
from models import SocialUser

def cleanup_expired_users():
    """Remove expired users from database"""
    with app.app_context():
        try:
            current_time = datetime.utcnow()
            expired_users = SocialUser.query.filter(SocialUser.expires_at <= current_time).all()
            
            if expired_users:
                for user in expired_users:
                    logging.info(f"Removing expired user: {user.username} ({user.platform})")
                    db.session.delete(user)
                
                db.session.commit()
                logging.info(f"Cleaned up {len(expired_users)} expired users")
            else:
                logging.debug("No expired users to clean up")
                
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error cleaning up expired users: {str(e)}")

def start_scheduler():
    """Start the background scheduler"""
    scheduler = BackgroundScheduler()
    
    # Run cleanup every hour
    scheduler.add_job(
        func=cleanup_expired_users,
        trigger="interval",
        hours=1,
        id='cleanup_expired_users'
    )
    
    # Run cleanup on startup
    scheduler.add_job(
        func=cleanup_expired_users,
        trigger="date",
        run_date=datetime.now()
    )
    
    scheduler.start()
    logging.info("Background scheduler started")
