// Smart Analytics System - Username popularity and recommendations
class SmartAnalytics {
    constructor() {
        this.userInteractions = this.loadUserInteractions();
        this.popularityData = this.loadPopularityData();
        this.init();
    }
    
    init() {
        this.trackUserInteractions();
        this.addPopularityIndicators();
        this.createRecommendationSystem();
        this.addUsageAnalytics();
        this.startRealTimeUpdates();
    }
    
    // Track how users interact with usernames
    trackUserInteractions() {
        // Track copy actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.copy-btn') || e.target.closest('.btn-copy-single')) {
                const card = e.target.closest('.user-card') || e.target.closest('.saved-username');
                const username = this.extractUsername(card);
                if (username) {
                    this.recordInteraction(username, 'copy');
                }
            }
            
            // Track save actions
            if (e.target.closest('.btn-collect')) {
                const card = e.target.closest('.user-card');
                const username = this.extractUsername(card);
                if (username) {
                    this.recordInteraction(username, 'save');
                }
            }
        });
        
        // Track double-click copy
        document.addEventListener('dblclick', (e) => {
            const card = e.target.closest('.user-card');
            if (card) {
                const username = this.extractUsername(card);
                if (username) {
                    this.recordInteraction(username, 'quick_copy');
                }
            }
        });
        
        // Track card views (when user hovers or touches)
        const userCards = document.querySelectorAll('.user-card');
        userCards.forEach(card => {
            const username = this.extractUsername(card);
            if (username) {
                // Desktop hover tracking
                card.addEventListener('mouseenter', () => {
                    this.recordInteraction(username, 'view');
                });
                
                // Mobile touch tracking
                card.addEventListener('touchstart', () => {
                    this.recordInteraction(username, 'view');
                });
            }
        });
    }
    
    recordInteraction(username, type) {
        const now = Date.now();
        
        if (!this.userInteractions[username]) {
            this.userInteractions[username] = {
                copy: 0,
                save: 0,
                quick_copy: 0,
                view: 0,
                lastInteraction: now,
                firstSeen: now,
                platform: this.getUsernamePlatform(username)
            };
        }
        
        this.userInteractions[username][type]++;
        this.userInteractions[username].lastInteraction = now;
        
        // Calculate popularity score
        this.updatePopularityScore(username);
        
        // Save to localStorage
        this.saveUserInteractions();
        
        // Update UI indicators
        this.updatePopularityIndicators();
    }
    
    updatePopularityScore(username) {
        const data = this.userInteractions[username];
        if (!data) return;
        
        // Calculate weighted score
        const weights = {
            copy: 3,
            save: 5,
            quick_copy: 2,
            view: 1
        };
        
        let score = 0;
        Object.keys(weights).forEach(action => {
            score += (data[action] || 0) * weights[action];
        });
        
        // Time decay factor (newer interactions are more valuable)
        const daysSinceFirst = (Date.now() - data.firstSeen) / (1000 * 60 * 60 * 24);
        const decayFactor = Math.max(0.1, 1 - (daysSinceFirst * 0.05));
        
        data.popularityScore = Math.round(score * decayFactor);
        this.popularityData[username] = data.popularityScore;
        
        this.savePopularityData();
    }
    
    addPopularityIndicators() {
        const userCards = document.querySelectorAll('.user-card');
        userCards.forEach(card => {
            const username = this.extractUsername(card);
            if (username && this.popularityData[username]) {
                this.addPopularityBadge(card, username);
            }
        });
    }
    
    addPopularityBadge(card, username) {
        const score = this.popularityData[username] || 0;
        let badgeClass, badgeText, badgeIcon;
        
        if (score >= 50) {
            badgeClass = 'popularity-legendary';
            badgeText = 'أسطوري';
            badgeIcon = '🔥';
        } else if (score >= 30) {
            badgeClass = 'popularity-hot';
            badgeText = 'رائج';
            badgeIcon = '⭐';
        } else if (score >= 15) {
            badgeClass = 'popularity-trending';
            badgeText = 'مميز';
            badgeIcon = '📈';
        } else if (score >= 5) {
            badgeClass = 'popularity-rising';
            badgeText = 'صاعد';
            badgeIcon = '💫';
        } else {
            return; // No badge for low scores
        }
        
        const header = card.querySelector('.user-card-header');
        if (header && !header.querySelector('.popularity-badge')) {
            const badge = document.createElement('div');
            badge.className = `popularity-badge ${badgeClass}`;
            badge.innerHTML = `${badgeIcon} ${badgeText}`;
            badge.title = `نقاط الشعبية: ${score}`;
            header.appendChild(badge);
        }
    }
    
    createRecommendationSystem() {
        // Add recommendations section
        const recommendationsSection = document.createElement('div');
        recommendationsSection.className = 'recommendations-section';
        recommendationsSection.innerHTML = `
            <div class="recommendations-header">
                <h3><i class="fas fa-brain"></i> توصيات ذكية</h3>
                <p>بناءً على اهتماماتك واستخدامك</p>
            </div>
            <div class="recommendations-content" id="recommendationsContent">
                <!-- Recommendations will be inserted here -->
            </div>
        `;
        
        // Insert after stats section
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            statsSection.after(recommendationsSection);
        }
        
        this.generateRecommendations();
    }
    
    generateRecommendations() {
        const contentDiv = document.getElementById('recommendationsContent');
        if (!contentDiv) return;
        
        const recommendations = this.calculateRecommendations();
        
        if (recommendations.length === 0) {
            contentDiv.innerHTML = `
                <div class="no-recommendations">
                    <i class="fas fa-lightbulb"></i>
                    <p>ابدأ بحفظ بعض اليوزرات لنقدم لك توصيات شخصية!</p>
                </div>
            `;
            return;
        }
        
        contentDiv.innerHTML = recommendations.map(rec => `
            <div class="recommendation-card">
                <div class="rec-icon">${rec.icon}</div>
                <div class="rec-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    ${rec.usernames ? `
                        <div class="rec-usernames">
                            ${rec.usernames.map(username => `
                                <span class="rec-username" onclick="smartAnalytics.copyRecommendation('${username}')">
                                    ${username}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
    
    calculateRecommendations() {
        const recommendations = [];
        const userPreferences = this.analyzeUserPreferences();
        
        // Most popular usernames
        const popularUsernames = this.getTopPopularUsernames(3);
        if (popularUsernames.length > 0) {
            recommendations.push({
                icon: '🔥',
                title: 'الأكثر شعبية',
                description: 'اليوزرات الأكثر إعجاباً من المستخدمين',
                usernames: popularUsernames
            });
        }
        
        // Platform preference recommendations
        if (userPreferences.preferredPlatform) {
            const platformUsernames = this.getUsernamesByPlatform(userPreferences.preferredPlatform, 3);
            if (platformUsernames.length > 0) {
                recommendations.push({
                    icon: userPreferences.preferredPlatform === 'instagram' ? '📸' : '🎵',
                    title: `يوزرات ${userPreferences.preferredPlatform === 'instagram' ? 'إنستغرام' : 'تيك توك'} مميزة`,
                    description: 'بناءً على اهتمامك بهذه المنصة',
                    usernames: platformUsernames
                });
            }
        }
        
        // Recently trending
        const trendingUsernames = this.getRecentlyTrendingUsernames(3);
        if (trendingUsernames.length > 0) {
            recommendations.push({
                icon: '📈',
                title: 'الرائجة حديثاً',
                description: 'يوزرات بدأت تكتسب شعبية مؤخراً',
                usernames: trendingUsernames
            });
        }
        
        // Usage tips
        recommendations.push({
            icon: '💡',
            title: 'نصائح ذكية',
            description: this.getSmartTip(),
        });
        
        return recommendations;
    }
    
    analyzeUserPreferences() {
        const preferences = {
            preferredPlatform: null,
            mostActiveTime: null,
            favoriteTypes: []
        };
        
        // Analyze platform preference
        let instagramCount = 0, tiktokCount = 0;
        Object.values(this.userInteractions).forEach(data => {
            if (data.platform === 'instagram') instagramCount += data.copy + data.save;
            if (data.platform === 'tiktok') tiktokCount += data.copy + data.save;
        });
        
        if (instagramCount > tiktokCount) {
            preferences.preferredPlatform = 'instagram';
        } else if (tiktokCount > instagramCount) {
            preferences.preferredPlatform = 'tiktok';
        }
        
        return preferences;
    }
    
    getTopPopularUsernames(count) {
        return Object.entries(this.popularityData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, count)
            .map(([username]) => username);
    }
    
    getUsernamesByPlatform(platform, count) {
        return Object.entries(this.userInteractions)
            .filter(([, data]) => data.platform === platform)
            .sort(([,a], [,b]) => (b.popularityScore || 0) - (a.popularityScore || 0))
            .slice(0, count)
            .map(([username]) => username);
    }
    
    getRecentlyTrendingUsernames(count) {
        const recent = Date.now() - (7 * 24 * 60 * 60 * 1000); // Last 7 days
        return Object.entries(this.userInteractions)
            .filter(([, data]) => data.lastInteraction > recent)
            .sort(([,a], [,b]) => b.lastInteraction - a.lastInteraction)
            .slice(0, count)
            .map(([username]) => username);
    }
    
    getSmartTip() {
        const tips = [
            'اضغط مرتين على أي يوزر للنسخ السريع',
            'احفظ اليوزرات المفضلة لديك لسهولة الوصول',
            'استخدم زر "نسخ الكل" لنسخ جميع اليوزرات المحفوظة',
            'اليوزرات الأكثر شعبية تظهر مع شارات خاصة',
            'تحديثات مستمرة لليوزرات الجديدة كل دقيقة'
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    }
    
    copyRecommendation(username) {
        navigator.clipboard.writeText(username).then(() => {
            showLuxuryNotification(`تم نسخ التوصية: ${username}`, 'success');
            this.recordInteraction(username, 'copy');
        });
    }
    
    addUsageAnalytics() {
        // Add analytics panel
        const analyticsPanel = document.createElement('div');
        analyticsPanel.className = 'analytics-panel';
        analyticsPanel.innerHTML = `
            <div class="analytics-header">
                <h4><i class="fas fa-chart-line"></i> إحصائياتك</h4>
            </div>
            <div class="analytics-stats" id="analyticsStats">
                <!-- Analytics will be inserted here -->
            </div>
        `;
        
        // Insert in the recommendations section
        const recSection = document.querySelector('.recommendations-section');
        if (recSection) {
            recSection.appendChild(analyticsPanel);
        }
        
        this.updateAnalyticsDisplay();
    }
    
    updateAnalyticsDisplay() {
        const statsDiv = document.getElementById('analyticsStats');
        if (!statsDiv) return;
        
        const totalInteractions = Object.values(this.userInteractions).reduce((sum, data) => {
            return sum + data.copy + data.save + data.quick_copy + data.view;
        }, 0);
        
        const totalUsernames = Object.keys(this.userInteractions).length;
        const savedCount = localStorage.getItem('tofi_collected_usernames') ? 
            JSON.parse(localStorage.getItem('tofi_collected_usernames')).length : 0;
        
        statsDiv.innerHTML = `
            <div class="analytics-stat">
                <div class="stat-number">${totalInteractions}</div>
                <div class="stat-label">إجمالي التفاعلات</div>
            </div>
            <div class="analytics-stat">
                <div class="stat-number">${totalUsernames}</div>
                <div class="stat-label">يوزرات تفاعلت معها</div>
            </div>
            <div class="analytics-stat">
                <div class="stat-number">${savedCount}</div>
                <div class="stat-label">يوزرات محفوظة</div>
            </div>
        `;
    }
    
    startRealTimeUpdates() {
        // Update analytics every 30 seconds
        setInterval(() => {
            this.updateAnalyticsDisplay();
            this.generateRecommendations();
        }, 30000);
    }
    
    // Utility functions
    extractUsername(element) {
        if (!element) return null;
        const usernameElement = element.querySelector('.username') || element.querySelector('.username-text');
        return usernameElement ? usernameElement.textContent.trim() : null;
    }
    
    getUsernamePlatform(username) {
        // Check all user cards to find platform
        const cards = document.querySelectorAll('.user-card');
        for (let card of cards) {
            const cardUsername = this.extractUsername(card);
            if (cardUsername === username) {
                const badge = card.querySelector('.platform-badge');
                if (badge) {
                    return badge.textContent.toLowerCase().includes('instagram') ? 'instagram' : 'tiktok';
                }
            }
        }
        return 'unknown';
    }
    
    // Storage functions
    loadUserInteractions() {
        const saved = localStorage.getItem('tofi_user_interactions');
        return saved ? JSON.parse(saved) : {};
    }
    
    saveUserInteractions() {
        localStorage.setItem('tofi_user_interactions', JSON.stringify(this.userInteractions));
    }
    
    loadPopularityData() {
        const saved = localStorage.getItem('tofi_popularity_data');
        return saved ? JSON.parse(saved) : {};
    }
    
    savePopularityData() {
        localStorage.setItem('tofi_popularity_data', JSON.stringify(this.popularityData));
    }
    
    updatePopularityIndicators() {
        // Remove existing badges and re-add them with updated data
        document.querySelectorAll('.popularity-badge').forEach(badge => badge.remove());
        this.addPopularityIndicators();
    }
}

// Initialize smart analytics
let smartAnalytics;
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        smartAnalytics = new SmartAnalytics();
    }, 1000);
});