// Username Collection System - Simple and focused on usernames
class UsernameCollector {
    constructor() {
        this.collectedUsernames = this.getCollectedUsernames();
        this.init();
    }
    
    init() {
        this.addUsernameCollectionFeature();
        this.showUsernameCounter();
        this.addQuickCopyFeatures();
        this.enhanceUserCards();
    }
    
    // Add username collection feature to each user card
    addUsernameCollectionFeature() {
        const userCards = document.querySelectorAll('.user-card');
        userCards.forEach(card => {
            const username = this.extractUsername(card);
            if (username) {
                this.addCollectionButton(card, username);
            }
        });
    }
    
    extractUsername(card) {
        const usernameElement = card.querySelector('.username');
        return usernameElement ? usernameElement.textContent.trim() : null;
    }
    
    addCollectionButton(card, username) {
        const footer = card.querySelector('.user-card-footer');
        if (footer) {
            const isCollected = this.collectedUsernames.includes(username);
            
            const collectBtn = document.createElement('button');
            collectBtn.className = `btn-collect ${isCollected ? 'collected' : ''}`;
            collectBtn.innerHTML = `
                <i class="fas fa-${isCollected ? 'check' : 'plus'}"></i>
                ${isCollected ? 'محفوظ' : 'حفظ'}
            `;
            collectBtn.onclick = () => this.toggleCollection(username, collectBtn);
            
            footer.appendChild(collectBtn);
        }
    }
    
    toggleCollection(username, button) {
        const isCollected = this.collectedUsernames.includes(username);
        
        if (isCollected) {
            this.removeUsername(username);
            button.className = 'btn-collect';
            button.innerHTML = '<i class="fas fa-plus"></i> حفظ';
            showLuxuryNotification(`تم إزالة ${username} من المجموعة`, 'info');
        } else {
            this.addUsername(username);
            button.className = 'btn-collect collected';
            button.innerHTML = '<i class="fas fa-check"></i> محفوظ';
            showLuxuryNotification(`تم إضافة ${username} للمجموعة`, 'success');
        }
        
        this.updateCounter();
    }
    
    addUsername(username) {
        if (!this.collectedUsernames.includes(username)) {
            this.collectedUsernames.push(username);
            this.saveCollectedUsernames();
        }
    }
    
    removeUsername(username) {
        const index = this.collectedUsernames.indexOf(username);
        if (index > -1) {
            this.collectedUsernames.splice(index, 1);
            this.saveCollectedUsernames();
        }
    }
    
    // Show counter of collected usernames
    showUsernameCounter() {
        const counter = document.createElement('div');
        counter.className = 'username-counter';
        counter.innerHTML = `
            <div class="counter-content">
                <i class="fas fa-bookmark"></i>
                <span class="counter-text">
                    <span class="counter-number" id="usernameCount">${this.collectedUsernames.length}</span>
                    <span class="counter-label">يوزر محفوظ</span>
                </span>
                <button class="btn-view-collection" onclick="usernameCollector.showCollection()">
                    <i class="fas fa-list"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(counter);
    }
    
    updateCounter() {
        const counterElement = document.getElementById('usernameCount');
        if (counterElement) {
            counterElement.textContent = this.collectedUsernames.length;
        }
    }
    
    // Show collected usernames
    showCollection() {
        if (this.collectedUsernames.length === 0) {
            showLuxuryNotification('لم تحفظ أي يوزرات بعد', 'info');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'collection-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>اليوزرات المحفوظة (${this.collectedUsernames.length})</h3>
                    <button class="btn-close" onclick="this.closest('.collection-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${this.collectedUsernames.map(username => `
                        <div class="saved-username">
                            <span class="username-text">${username}</span>
                            <div class="username-actions">
                                <button class="btn-copy-single" onclick="usernameCollector.copyUsername('${username}')">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="btn-remove-single" onclick="usernameCollector.removeFromModal('${username}', this)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="modal-footer">
                    <button class="btn-copy-all" onclick="usernameCollector.copyAllUsernames()">
                        <i class="fas fa-copy"></i>
                        نسخ الكل
                    </button>
                    <button class="btn-clear-all" onclick="usernameCollector.clearAll()">
                        <i class="fas fa-trash"></i>
                        مسح الكل
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    copyUsername(username) {
        navigator.clipboard.writeText(username).then(() => {
            showLuxuryNotification(`تم نسخ: ${username}`, 'success');
        });
    }
    
    copyAllUsernames() {
        const allUsernames = this.collectedUsernames.join('\n');
        navigator.clipboard.writeText(allUsernames).then(() => {
            showLuxuryNotification(`تم نسخ ${this.collectedUsernames.length} يوزر`, 'success');
        });
    }
    
    removeFromModal(username, button) {
        this.removeUsername(username);
        this.updateCounter();
        button.closest('.saved-username').remove();
        showLuxuryNotification(`تم حذف ${username}`, 'info');
        
        // Update collect buttons in main page
        this.refreshCollectButtons();
    }
    
    clearAll() {
        if (confirm('هل أنت متأكد من حذف جميع اليوزرات المحفوظة؟')) {
            this.collectedUsernames = [];
            this.saveCollectedUsernames();
            this.updateCounter();
            document.querySelector('.collection-modal').remove();
            this.refreshCollectButtons();
            showLuxuryNotification('تم مسح جميع اليوزرات', 'info');
        }
    }
    
    refreshCollectButtons() {
        const collectButtons = document.querySelectorAll('.btn-collect');
        collectButtons.forEach(button => {
            const card = button.closest('.user-card');
            const username = this.extractUsername(card);
            const isCollected = this.collectedUsernames.includes(username);
            
            button.className = `btn-collect ${isCollected ? 'collected' : ''}`;
            button.innerHTML = `
                <i class="fas fa-${isCollected ? 'check' : 'plus'}"></i>
                ${isCollected ? 'محفوظ' : 'حفظ'}
            `;
        });
    }
    
    // Quick copy features
    addQuickCopyFeatures() {
        // Double click to copy username
        const userCards = document.querySelectorAll('.user-card');
        userCards.forEach(card => {
            card.addEventListener('dblclick', () => {
                const username = this.extractUsername(card);
                if (username) {
                    navigator.clipboard.writeText(username).then(() => {
                        showLuxuryNotification(`نسخ سريع: ${username}`, 'success');
                        this.addQuickCopyEffect(card);
                    });
                }
            });
        });
    }
    
    addQuickCopyEffect(card) {
        card.classList.add('quick-copied');
        setTimeout(() => {
            card.classList.remove('quick-copied');
        }, 1000);
    }
    
    // Enhance user cards with better mobile support
    enhanceUserCards() {
        const userCards = document.querySelectorAll('.user-card');
        userCards.forEach(card => {
            // Add touch-friendly hover effects
            card.addEventListener('touchstart', () => {
                card.classList.add('touch-active');
            });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.classList.remove('touch-active');
                }, 300);
            });
        });
    }
    
    // Storage functions
    getCollectedUsernames() {
        const saved = localStorage.getItem('tofi_collected_usernames');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveCollectedUsernames() {
        localStorage.setItem('tofi_collected_usernames', JSON.stringify(this.collectedUsernames));
    }
}

// Initialize the username collector
let usernameCollector;
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        usernameCollector = new UsernameCollector();
    }, 500);
});