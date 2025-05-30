from datetime import datetime, timedelta
from app import db

class SocialUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    platform = db.Column(db.String(20), nullable=False)  # 'instagram' or 'tiktok'
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    
    def __init__(self, username, platform):
        self.username = username
        self.platform = platform
        self.added_at = datetime.utcnow()
        self.expires_at = self.added_at + timedelta(hours=24)
    
    @property
    def time_remaining(self):
        """Return time remaining in hours and minutes"""
        if datetime.utcnow() >= self.expires_at:
            return "منتهي الصلاحية"
        
        remaining = self.expires_at - datetime.utcnow()
        hours = remaining.seconds // 3600
        minutes = (remaining.seconds % 3600) // 60
        
        if remaining.days > 0:
            return f"{remaining.days} يوم و {hours} ساعة"
        elif hours > 0:
            return f"{hours} ساعة و {minutes} دقيقة"
        else:
            return f"{minutes} دقيقة"
    
    @property
    def profile_url(self):
        """Return the profile URL based on platform"""
        if self.platform == 'instagram':
            return f"https://instagram.com/{self.username}"
        elif self.platform == 'tiktok':
            return f"https://tiktok.com/@{self.username}"
        return "#"
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'platform': self.platform,
            'added_at': self.added_at.isoformat(),
            'expires_at': self.expires_at.isoformat(),
            'time_remaining': self.time_remaining,
            'profile_url': self.profile_url
        }

class AdminUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
