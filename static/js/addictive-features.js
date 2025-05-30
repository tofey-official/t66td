// Addictive Features System - Makes the website irresistible
class AddictiveSystem {
    constructor() {
        this.achievements = [];
        this.visitCount = this.getVisitCount();
        this.timeSpent = 0;
        this.scrollDistance = 0;
        this.clickCount = 0;
        this.init();
    }
    
    init() {
        this.trackUserActivity();
        this.startProgressSystem();
        this.initAchievementSystem();
        this.startMysteryCountdown();
        this.addHypnoticEffects();
        this.startRewardSystem();
        // Removed sound effects
        this.createFloatingElements();
    }
    
    // Track user activity to create engagement
    trackUserActivity() {
        // Track time spent
        setInterval(() => {
            this.timeSpent++;
            this.updateProgressBar();
            this.checkTimeAchievements();
        }, 1000);
        
        // Track scrolling
        window.addEventListener('scroll', () => {
            this.scrollDistance += Math.abs(window.scrollY);
            this.createScrollParticles();
            this.checkScrollAchievements();
        });
        
        // Track clicks
        document.addEventListener('click', (e) => {
            this.clickCount++;
            this.createClickEffect(e);
            this.checkClickAchievements();
        });
        
        // Mouse trail effect
        document.addEventListener('mousemove', (e) => {
            this.createMouseTrail(e);
        });
    }
    
    // Progress system that never ends
    startProgressSystem() {
        const progressBar = document.createElement('div');
        progressBar.className = 'addictive-progress-bar';
        progressBar.innerHTML = `
            <div class="progress-container">
                <div class="progress-label">تقدمك نحو الكنز الذهبي</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                    <div class="progress-sparkle"></div>
                </div>
                <div class="progress-percentage" id="progressPercentage">0%</div>
            </div>
        `;
        
        document.body.appendChild(progressBar);
        this.updateProgressBar();
    }
    
    updateProgressBar() {
        const progress = Math.min((this.timeSpent * 2 + this.clickCount * 5 + this.scrollDistance / 100) % 100, 99);
        const progressFill = document.getElementById('progressFill');
        const progressPercentage = document.getElementById('progressPercentage');
        
        if (progressFill && progressPercentage) {
            progressFill.style.width = `${progress}%`;
            progressPercentage.textContent = `${Math.floor(progress)}%`;
            
            // When close to 100%, show mysterious message
            if (progress > 95) {
                this.showMysteryMessage();
                // Reset to create endless loop
                setTimeout(() => {
                    this.timeSpent = 0;
                    this.clickCount = 0;
                    this.scrollDistance = 0;
                }, 3000);
            }
        }
    }
    
    // Achievement system
    initAchievementSystem() {
        this.achievementContainer = document.createElement('div');
        this.achievementContainer.className = 'achievement-container';
        document.body.appendChild(this.achievementContainer);
    }
    
    checkTimeAchievements() {
        const timeAchievements = [
            { time: 30, title: 'المستكشف', message: 'قضيت 30 ثانية في استكشاف الكنوز!' },
            { time: 60, title: 'الباحث', message: 'دقيقة كاملة من البحث عن اليوزرات النادرة!' },
            { time: 120, title: 'الخبير', message: 'دقيقتان! أنت خبير حقيقي في اليوزرات!' },
            { time: 300, title: 'الأسطورة', message: '5 دقائق! أصبحت أسطورة في عالم اليوزرات!' }
        ];
        
        timeAchievements.forEach(achievement => {
            if (this.timeSpent === achievement.time && !this.achievements.includes(achievement.title)) {
                this.unlockAchievement(achievement);
            }
        });
    }
    
    checkScrollAchievements() {
        const scrollAchievements = [
            { distance: 1000, title: 'المتصفح', message: 'تصفحت المحتوى بخبرة!' },
            { distance: 5000, title: 'المتجول', message: 'رحلة طويلة عبر اليوزرات!' },
            { distance: 10000, title: 'الرحالة', message: 'رحالة حقيقي في عالم المحتوى!' }
        ];
        
        scrollAchievements.forEach(achievement => {
            if (this.scrollDistance > achievement.distance && !this.achievements.includes(achievement.title)) {
                this.unlockAchievement(achievement);
            }
        });
    }
    
    checkClickAchievements() {
        const clickAchievements = [
            { clicks: 10, title: 'النشيط', message: '10 نقرات! أنت نشيط جداً!' },
            { clicks: 25, title: 'المتفاعل', message: '25 نقرة! تفاعل رائع!' },
            { clicks: 50, title: 'البطل', message: '50 نقرة! أنت بطل التفاعل!' }
        ];
        
        clickAchievements.forEach(achievement => {
            if (this.clickCount === achievement.clicks && !this.achievements.includes(achievement.title)) {
                this.unlockAchievement(achievement);
            }
        });
    }
    
    unlockAchievement(achievement) {
        this.achievements.push(achievement.title);
        
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement-unlock';
        achievementElement.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-info">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-message">${achievement.message}</div>
                </div>
            </div>
        `;
        
        this.achievementContainer.appendChild(achievementElement);
        
        // Play achievement sound
        this.playAchievementSound();
        
        // Remove after animation
        setTimeout(() => {
            achievementElement.remove();
        }, 5000);
        
        // Show reward
        this.showReward();
    }
    
    // Mystery countdown that creates urgency
    startMysteryCountdown() {
        const countdownElement = document.createElement('div');
        countdownElement.className = 'mystery-countdown';
        countdownElement.innerHTML = `
            <div class="countdown-content">
                <div class="countdown-icon">⚡</div>
                <div class="countdown-text">
                    <div class="countdown-title">حدث خاص ينتهي خلال:</div>
                    <div class="countdown-timer" id="mysteryTimer">05:00</div>
                    <div class="countdown-subtitle">لا تفوت الفرصة!</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(countdownElement);
        
        let timeLeft = 300; // 5 minutes
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('mysteryTimer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            timeLeft--;
            
            if (timeLeft < 0) {
                // Reset timer to create endless urgency
                timeLeft = 300;
                this.showMysteryReward();
            }
        }, 1000);
    }
    
    // Hypnotic visual effects
    addHypnoticEffects() {
        // Pulse effect on important elements
        const pulseElements = document.querySelectorAll('.user-card, .live-stat-card, .feature-card');
        pulseElements.forEach((element, index) => {
            element.style.animation = `hypnoticPulse ${3 + index * 0.5}s ease-in-out infinite`;
        });
        
        // Rainbow border effect
        setInterval(() => {
            const cards = document.querySelectorAll('.user-card');
            cards.forEach(card => {
                card.style.borderColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
            });
        }, 2000);
        
        // Floating particles
        this.createFloatingParticles();
    }
    
    createFloatingParticles() {
        setInterval(() => {
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('div');
                particle.className = 'floating-particle';
                particle.innerHTML = ['💎', '⭐', '🌟', '✨', '💫'][Math.floor(Math.random() * 5)];
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 5000);
            }
        }, 1000);
    }
    
    // Reward system
    startRewardSystem() {
        // Random rewards popup
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance every 10 seconds
                this.showRandomReward();
            }
        }, 10000);
    }
    
    showRandomReward() {
        const rewards = [
            { icon: '🎁', title: 'مكافأة مجانية!', message: 'حصلت على نقاط إضافية!' },
            { icon: '💰', title: 'كنز ذهبي!', message: 'اكتشفت كنزاً خفياً!' },
            { icon: '🏆', title: 'إنجاز رائع!', message: 'أنت الأفضل اليوم!' },
            { icon: '⚡', title: 'قوة خارقة!', message: 'طاقتك تتضاعف!' }
        ];
        
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        this.showRewardPopup(reward);
    }
    
    showRewardPopup(reward) {
        const popup = document.createElement('div');
        popup.className = 'reward-popup';
        popup.innerHTML = `
            <div class="reward-content">
                <div class="reward-icon">${reward.icon}</div>
                <div class="reward-title">${reward.title}</div>
                <div class="reward-message">${reward.message}</div>
                <button class="reward-claim" onclick="this.parentElement.parentElement.remove()">
                    احصل عليها الآن!
                </button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            if (popup.parentElement) {
                popup.remove();
            }
        }, 8000);
    }
    
    // Special effects for interactions
    createClickEffect(e) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.style.left = e.clientX + 'px';
        effect.style.top = e.clientY + 'px';
        effect.innerHTML = `+${Math.floor(Math.random() * 10) + 1}`;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }
    
    createMouseTrail(e) {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 500);
    }
    
    createScrollParticles() {
        if (Math.random() < 0.1) { // 10% chance
            const particle = document.createElement('div');
            particle.className = 'scroll-particle';
            particle.innerHTML = '✨';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.scrollY + window.innerHeight + 'px';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }
    
    // Sound effects (using Web Audio API)
    playAchievementSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Fallback for browsers that don't support Web Audio API
            console.log('🎵 Achievement unlocked!');
        }
    }
    
    // Mystery messages
    showMysteryMessage() {
        const messages = [
            'شيء مذهل على وشك الحدوث...',
            'الكنز الذهبي يقترب...',
            'أنت على بُعد خطوة واحدة من المفاجأة!',
            'سر عظيم سيُكشف قريباً...',
            'قوة خفية تتراكم...'
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        showLuxuryNotification(message, 'info');
    }
    
    showMysteryReward() {
        showLuxuryNotification('🎊 مبروك! حصلت على مكافأة الحدث الخاص! 🎊', 'success');
    }
    
    showReward() {
        const rewards = ['🏆', '💎', '⭐', '🌟', '✨'];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        showLuxuryNotification(`رائع! حصلت على ${reward}`, 'success');
    }
    
    // Utility functions
    getVisitCount() {
        const count = localStorage.getItem('tofi_visit_count') || 0;
        const newCount = parseInt(count) + 1;
        localStorage.setItem('tofi_visit_count', newCount);
        return newCount;
    }
    
    createFloatingElements() {
        // Create floating golden coins
        setInterval(() => {
            const coin = document.createElement('div');
            coin.className = 'floating-coin';
            coin.innerHTML = '🪙';
            coin.style.left = Math.random() * window.innerWidth + 'px';
            coin.style.animationDuration = (Math.random() * 4 + 3) + 's';
            
            document.body.appendChild(coin);
            
            coin.addEventListener('click', () => {
                coin.innerHTML = '💥';
                showLuxuryNotification('عملة ذهبية! +100 نقطة!', 'success');
                setTimeout(() => coin.remove(), 500);
            });
            
            setTimeout(() => {
                if (coin.parentElement) coin.remove();
            }, 7000);
        }, 3000);
    }
}

// Initialize the addictive system
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        new AddictiveSystem();
    }, 1000);
});