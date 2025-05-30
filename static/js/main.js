// Main JavaScript for Sharohat Tofi Social Media Platform
document.addEventListener('DOMContentLoaded', function() {
    console.log('شروحات توفي - تم تحميل الموقع بنجاح');
    
    // Initialize animations and interactions
    initializeAnimations();
    initializeCountdown();
    initializeTooltips();
    
    // Auto-refresh functionality
    startAutoRefresh();
});

/**
 * Initialize page animations
 */
function initializeAnimations() {
    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all user cards
    document.querySelectorAll('.user-card, .api-card, .stat-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

/**
 * Initialize real-time countdown for user expiration
 */
function initializeCountdown() {
    const timeElements = document.querySelectorAll('.time-remaining span');
    
    if (timeElements.length === 0) return;
    
    // Update countdown every minute
    setInterval(updateCountdowns, 60000);
    
    function updateCountdowns() {
        // Refresh page to get updated time remaining
        // In a real application, you might want to use AJAX here
        location.reload();
    }
}

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

/**
 * Start auto-refresh functionality
 */
function startAutoRefresh() {
    // Refresh main page every 60 seconds
    if (window.location.pathname === '/') {
        setTimeout(() => {
            console.log('تحديث تلقائي للصفحة الرئيسية');
            location.reload();
        }, 60000);
    }
    
    // Refresh admin dashboard every 30 seconds
    if (window.location.pathname === '/admin/dashboard') {
        setTimeout(() => {
            console.log('تحديث تلقائي للوحة التحكم');
            location.reload();
        }, 30000);
    }
}

/**
 * Copy text to clipboard with visual feedback
 */
function copyToClipboard(text) {
    const fullUrl = window.location.origin + text;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(fullUrl).then(function() {
            showCopySuccess();
        }).catch(function(err) {
            console.error('فشل في النسخ: ', err);
            fallbackCopy(fullUrl);
        });
    } else {
        fallbackCopy(fullUrl);
    }
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('فشل في النسخ: ', err);
        showCopyError();
    } finally {
        document.body.removeChild(textArea);
    }
}

/**
 * Show copy success feedback
 */
function showCopySuccess() {
    // Find the button that was clicked
    const btn = event.target.closest('.btn-copy');
    if (btn) {
        const originalHTML = btn.innerHTML;
        const originalColor = btn.style.color;
        
        btn.innerHTML = '<i class="fas fa-check"></i> تم النسخ';
        btn.style.backgroundColor = '#00ff88';
        btn.style.color = 'white';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.backgroundColor = '';
            btn.style.color = originalColor;
        }, 2000);
    }
    
    // Show toast notification
    showToast('تم نسخ الرابط بنجاح!', 'success');
}

/**
 * Show copy error feedback
 */
function showCopyError() {
    showToast('فشل في نسخ الرابط', 'error');
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff3333' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

/**
 * Format time remaining for display
 */
function formatTimeRemaining(expiresAt) {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) {
        return 'منتهي الصلاحية';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
        return `${hours} ساعة و ${minutes} دقيقة`;
    } else {
        return `${minutes} دقيقة`;
    }
}

/**
 * Add smooth scroll behavior to navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Add loading state to forms
 */
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
        }
    });
});

/**
 * Handle responsive navigation
 */
function handleResponsiveNav() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
        
        // Close nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                navbarCollapse.classList.remove('show');
            }
        });
    }
}

// Initialize responsive navigation
handleResponsiveNav();

/**
 * Add search functionality for admin dashboard
 */
function initializeAdminSearch() {
    const searchInput = document.querySelector('#userSearch');
    const userRows = document.querySelectorAll('.admin-table tbody tr');
    
    if (searchInput && userRows.length > 0) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            userRows.forEach(row => {
                const username = row.querySelector('.user-cell span').textContent.toLowerCase();
                const platform = row.querySelector('.platform-badge').textContent.toLowerCase();
                
                if (username.includes(searchTerm) || platform.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
}

// Initialize admin search if on admin page
if (window.location.pathname.includes('/admin')) {
    initializeAdminSearch();
}

// Export functions for global access
window.copyToClipboard = copyToClipboard;
window.showToast = showToast;
window.formatTimeRemaining = formatTimeRemaining;

console.log('شروحات توفي - تم تحميل JavaScript بنجاح');
