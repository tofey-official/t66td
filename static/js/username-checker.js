// Username Availability Checker - Unique feature for checking username availability
class UsernameChecker {
    constructor() {
        this.checkedUsernames = this.loadCheckedUsernames();
        this.init();
    }
    
    init() {
        this.addAvailabilityChecker();
        this.createUsernameGenerator();
        this.addBulkChecker();
        this.createSimilarUsernamesFeature();
    }
    
    // Add availability check feature to each username
    addAvailabilityChecker() {
        const userCards = document.querySelectorAll('.user-card');
        userCards.forEach(card => {
            const username = this.extractUsername(card);
            const platform = this.extractPlatform(card);
            if (username && platform) {
                this.addCheckButton(card, username, platform);
            }
        });
    }
    
    addCheckButton(card, username, platform) {
        const footer = card.querySelector('.user-card-footer');
        if (footer && !footer.querySelector('.check-availability-btn')) {
            const checkBtn = document.createElement('button');
            checkBtn.className = 'check-availability-btn';
            checkBtn.innerHTML = '<i class="fas fa-search"></i> فحص التوفر';
            checkBtn.onclick = () => this.checkAvailability(username, platform, checkBtn);
            
            footer.appendChild(checkBtn);
            
            // Show cached result if available
            const cached = this.getCachedResult(username, platform);
            if (cached) {
                this.updateCheckButton(checkBtn, cached.status, cached.lastChecked);
            }
        }
    }
    
    async checkAvailability(username, platform, button) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الفحص...';
        button.disabled = true;
        
        try {
            // Simulate availability check (in real implementation, you'd use APIs)
            const isAvailable = await this.performAvailabilityCheck(username, platform);
            const status = isAvailable ? 'available' : 'taken';
            const now = new Date().toISOString();
            
            // Cache result
            this.cacheResult(username, platform, status, now);
            
            // Update button
            this.updateCheckButton(button, status, now);
            
            // Show notification
            const statusText = isAvailable ? 'متاح' : 'مأخوذ';
            const notificationType = isAvailable ? 'success' : 'warning';
            showLuxuryNotification(`${username} على ${platform}: ${statusText}`, notificationType);
            
        } catch (error) {
            button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> خطأ في الفحص';
            showLuxuryNotification('حدث خطأ أثناء فحص التوفر', 'error');
        }
        
        button.disabled = false;
    }
    
    async performAvailabilityCheck(username, platform) {
        // Simulate API call with random result for demo
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Simple logic: shorter usernames are more likely to be taken
        const availability = username.length > 6 ? Math.random() > 0.3 : Math.random() > 0.7;
        return availability;
    }
    
    updateCheckButton(button, status, lastChecked) {
        const timeAgo = this.getTimeAgo(lastChecked);
        
        if (status === 'available') {
            button.className = 'check-availability-btn available';
            button.innerHTML = '<i class="fas fa-check"></i> متاح';
            button.title = `تم الفحص ${timeAgo}`;
        } else {
            button.className = 'check-availability-btn taken';
            button.innerHTML = '<i class="fas fa-times"></i> مأخوذ';
            button.title = `تم الفحص ${timeAgo}`;
        }
    }
    
    // Create username generator feature
    createUsernameGenerator() {
        const generatorSection = document.createElement('div');
        generatorSection.className = 'username-generator-section';
        generatorSection.innerHTML = `
            <div class="generator-header">
                <h3><i class="fas fa-magic"></i> مولد اليوزرات الذكي</h3>
                <p>أنشئ يوزرات فريدة ومتاحة</p>
            </div>
            <div class="generator-content">
                <div class="generator-inputs">
                    <input type="text" id="baseUsername" placeholder="الاسم الأساسي (مثال: ahmed)" class="generator-input">
                    <select id="platformSelect" class="generator-select">
                        <option value="instagram">إنستغرام</option>
                        <option value="tiktok">تيك توك</option>
                    </select>
                    <button class="generate-btn" onclick="usernameChecker.generateUsernames()">
                        <i class="fas fa-wand-magic-sparkles"></i> إنشاء يوزرات
                    </button>
                </div>
                <div class="generated-usernames" id="generatedUsernames"></div>
            </div>
        `;
        
        // Insert after recommendations section
        const recSection = document.querySelector('.recommendations-section');
        if (recSection) {
            recSection.after(generatorSection);
        }
    }
    
    generateUsernames() {
        const baseUsername = document.getElementById('baseUsername').value.trim();
        const platform = document.getElementById('platformSelect').value;
        
        if (!baseUsername) {
            showLuxuryNotification('أدخل اسماً أساسياً لإنشاء اليوزرات', 'warning');
            return;
        }
        
        const variations = this.createUsernameVariations(baseUsername);
        this.displayGeneratedUsernames(variations, platform);
    }
    
    createUsernameVariations(base) {
        const variations = [];
        const suffixes = ['_official', '2024', '_vip', '_pro', '_real', '_original', 'x', '_1'];
        const prefixes = ['official_', 'real_', 'the_', 'mr_', 'miss_'];
        const numbers = ['1', '2', '3', '7', '9', '123', '2024'];
        
        // Original
        variations.push(base);
        
        // With suffixes
        suffixes.forEach(suffix => {
            variations.push(base + suffix);
        });
        
        // With prefixes
        prefixes.forEach(prefix => {
            variations.push(prefix + base);
        });
        
        // With numbers
        numbers.forEach(num => {
            variations.push(base + num);
            variations.push(base + '_' + num);
        });
        
        // Creative combinations
        variations.push(base + '_x');
        variations.push('i_am_' + base);
        variations.push(base + '_here');
        variations.push('its_' + base);
        
        return variations.slice(0, 12); // Limit to 12 suggestions
    }
    
    displayGeneratedUsernames(usernames, platform) {
        const container = document.getElementById('generatedUsernames');
        container.innerHTML = `
            <h4>اقتراحات اليوزرات لـ ${platform === 'instagram' ? 'إنستغرام' : 'تيك توك'}:</h4>
            <div class="username-suggestions">
                ${usernames.map(username => `
                    <div class="suggestion-item">
                        <span class="suggested-username">${username}</span>
                        <div class="suggestion-actions">
                            <button class="btn-copy-suggestion" onclick="usernameChecker.copySuggestion('${username}')">
                                <i class="fas fa-copy"></i>
                            </button>
                            <button class="btn-check-suggestion" onclick="usernameChecker.checkSuggestion('${username}', '${platform}', this)">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    copySuggestion(username) {
        navigator.clipboard.writeText(username).then(() => {
            showLuxuryNotification(`تم نسخ: ${username}`, 'success');
        });
    }
    
    async checkSuggestion(username, platform, button) {
        const originalHtml = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;
        
        try {
            const isAvailable = await this.performAvailabilityCheck(username, platform);
            const suggestionItem = button.closest('.suggestion-item');
            
            if (isAvailable) {
                suggestionItem.classList.add('available');
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.className = 'btn-check-suggestion available';
                showLuxuryNotification(`${username} متاح!`, 'success');
            } else {
                suggestionItem.classList.add('taken');
                button.innerHTML = '<i class="fas fa-times"></i>';
                button.className = 'btn-check-suggestion taken';
                showLuxuryNotification(`${username} مأخوذ`, 'warning');
            }
        } catch (error) {
            button.innerHTML = originalHtml;
            showLuxuryNotification('خطأ في فحص التوفر', 'error');
        }
        
        button.disabled = false;
    }
    
    // Add bulk checker for multiple usernames
    addBulkChecker() {
        const bulkSection = document.createElement('div');
        bulkSection.className = 'bulk-checker-section';
        bulkSection.innerHTML = `
            <div class="bulk-header">
                <h3><i class="fas fa-list-check"></i> فحص جماعي لليوزرات</h3>
                <p>افحص عدة يوزرات دفعة واحدة</p>
            </div>
            <div class="bulk-content">
                <textarea id="bulkUsernames" placeholder="أدخل اليوزرات (كل يوزر في سطر منفصل)&#10;مثال:&#10;ahmed123&#10;sara_official&#10;mohammed2024" class="bulk-input"></textarea>
                <div class="bulk-controls">
                    <select id="bulkPlatform" class="bulk-platform-select">
                        <option value="instagram">إنستغرام</option>
                        <option value="tiktok">تيك توك</option>
                    </select>
                    <button class="bulk-check-btn" onclick="usernameChecker.bulkCheck()">
                        <i class="fas fa-search-plus"></i> فحص جماعي
                    </button>
                </div>
                <div class="bulk-results" id="bulkResults"></div>
            </div>
        `;
        
        const generatorSection = document.querySelector('.username-generator-section');
        if (generatorSection) {
            generatorSection.after(bulkSection);
        }
    }
    
    async bulkCheck() {
        const usernames = document.getElementById('bulkUsernames').value
            .split('\n')
            .map(u => u.trim())
            .filter(u => u.length > 0);
        
        const platform = document.getElementById('bulkPlatform').value;
        
        if (usernames.length === 0) {
            showLuxuryNotification('أدخل يوزرات للفحص', 'warning');
            return;
        }
        
        const resultsContainer = document.getElementById('bulkResults');
        resultsContainer.innerHTML = '<div class="bulk-checking">جاري فحص اليوزرات...</div>';
        
        const results = [];
        
        for (let i = 0; i < usernames.length; i++) {
            const username = usernames[i];
            try {
                const isAvailable = await this.performAvailabilityCheck(username, platform);
                results.push({
                    username,
                    available: isAvailable,
                    status: isAvailable ? 'متاح' : 'مأخوذ'
                });
                
                // Update progress
                resultsContainer.innerHTML = `
                    <div class="bulk-progress">فحص ${i + 1} من ${usernames.length}...</div>
                `;
            } catch (error) {
                results.push({
                    username,
                    available: null,
                    status: 'خطأ'
                });
            }
        }
        
        this.displayBulkResults(results, platform);
    }
    
    displayBulkResults(results, platform) {
        const container = document.getElementById('bulkResults');
        const available = results.filter(r => r.available === true);
        const taken = results.filter(r => r.available === false);
        const errors = results.filter(r => r.available === null);
        
        container.innerHTML = `
            <div class="bulk-summary">
                <div class="summary-stat available">
                    <span class="stat-number">${available.length}</span>
                    <span class="stat-label">متاح</span>
                </div>
                <div class="summary-stat taken">
                    <span class="stat-number">${taken.length}</span>
                    <span class="stat-label">مأخوذ</span>
                </div>
                ${errors.length > 0 ? `
                    <div class="summary-stat error">
                        <span class="stat-number">${errors.length}</span>
                        <span class="stat-label">خطأ</span>
                    </div>
                ` : ''}
            </div>
            <div class="bulk-detailed-results">
                ${results.map(result => `
                    <div class="bulk-result-item ${result.available === true ? 'available' : result.available === false ? 'taken' : 'error'}">
                        <span class="result-username">${result.username}</span>
                        <span class="result-status">${result.status}</span>
                        ${result.available === true ? `
                            <button class="btn-copy-available" onclick="usernameChecker.copySuggestion('${result.username}')">
                                <i class="fas fa-copy"></i>
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Create similar usernames feature
    createSimilarUsernamesFeature() {
        // Add "Find Similar" button to each user card
        const userCards = document.querySelectorAll('.user-card');
        userCards.forEach(card => {
            const username = this.extractUsername(card);
            if (username) {
                this.addSimilarButton(card, username);
            }
        });
    }
    
    addSimilarButton(card, username) {
        const footer = card.querySelector('.user-card-footer');
        if (footer && !footer.querySelector('.find-similar-btn')) {
            const similarBtn = document.createElement('button');
            similarBtn.className = 'find-similar-btn';
            similarBtn.innerHTML = '<i class="fas fa-clone"></i> مشابه';
            similarBtn.onclick = () => this.findSimilarUsernames(username);
            
            footer.appendChild(similarBtn);
        }
    }
    
    findSimilarUsernames(baseUsername) {
        const similar = this.generateSimilarUsernames(baseUsername);
        
        const modal = document.createElement('div');
        modal.className = 'similar-usernames-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>يوزرات مشابهة لـ: ${baseUsername}</h3>
                    <button class="btn-close" onclick="this.closest('.similar-usernames-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="similar-usernames-grid">
                        ${similar.map(username => `
                            <div class="similar-username-item">
                                <span class="similar-username-text">${username}</span>
                                <button class="btn-copy-similar" onclick="usernameChecker.copySuggestion('${username}')">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    generateSimilarUsernames(base) {
        const similar = [];
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        
        // Replace characters
        for (let i = 0; i < base.length; i++) {
            for (let j = 0; j < 3; j++) {
                const newChar = characters[Math.floor(Math.random() * characters.length)];
                const newUsername = base.substring(0, i) + newChar + base.substring(i + 1);
                if (newUsername !== base) {
                    similar.push(newUsername);
                }
            }
        }
        
        // Add/remove characters
        for (let i = 0; i <= base.length; i++) {
            const newChar = characters[Math.floor(Math.random() * characters.length)];
            similar.push(base.substring(0, i) + newChar + base.substring(i));
        }
        
        // Remove duplicates and limit
        return [...new Set(similar)].slice(0, 15);
    }
    
    // Utility functions
    extractUsername(card) {
        const usernameElement = card.querySelector('.username');
        return usernameElement ? usernameElement.textContent.trim() : null;
    }
    
    extractPlatform(card) {
        const badge = card.querySelector('.platform-badge');
        if (badge) {
            return badge.textContent.toLowerCase().includes('instagram') ? 'instagram' : 'tiktok';
        }
        return 'instagram';
    }
    
    getCachedResult(username, platform) {
        const key = `${username}_${platform}`;
        return this.checkedUsernames[key] || null;
    }
    
    cacheResult(username, platform, status, timestamp) {
        const key = `${username}_${platform}`;
        this.checkedUsernames[key] = {
            status,
            lastChecked: timestamp
        };
        this.saveCheckedUsernames();
    }
    
    getTimeAgo(timestamp) {
        const now = new Date();
        const checked = new Date(timestamp);
        const diffInMinutes = Math.floor((now - checked) / 60000);
        
        if (diffInMinutes < 1) return 'الآن';
        if (diffInMinutes < 60) return `قبل ${diffInMinutes} دقيقة`;
        const hours = Math.floor(diffInMinutes / 60);
        if (hours < 24) return `قبل ${hours} ساعة`;
        const days = Math.floor(hours / 24);
        return `قبل ${days} يوم`;
    }
    
    // Storage functions
    loadCheckedUsernames() {
        const saved = localStorage.getItem('tofi_checked_usernames');
        return saved ? JSON.parse(saved) : {};
    }
    
    saveCheckedUsernames() {
        localStorage.setItem('tofi_checked_usernames', JSON.stringify(this.checkedUsernames));
    }
}

// Initialize username checker
let usernameChecker;
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        usernameChecker = new UsernameChecker();
    }, 1500);
});