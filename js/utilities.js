/**
 * Utility functions for the AWPL Blog
 */

// Lazy loading for images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        let lazyImages = document.querySelectorAll('img[data-src]');
        
        function lazyLoad() {
            lazyImages.forEach(img => {
                if (img.getBoundingClientRect().top <= window.innerHeight && 
                    img.getBoundingClientRect().bottom >= 0 && 
                    getComputedStyle(img).display !== 'none') {
                    
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
            
            // Remove already loaded images from the array
            lazyImages = Array.from(lazyImages).filter(img => img.hasAttribute('data-src'));
            
            if (lazyImages.length === 0) {
                document.removeEventListener('scroll', throttledLazyLoad);
                window.removeEventListener('resize', throttledLazyLoad);
                window.removeEventListener('orientationchange', throttledLazyLoad);
            }
        }
        
        // Throttle function to limit execution
        function throttle(callback, limit) {
            let waiting = false;
            return function() {
                if (!waiting) {
                    callback.apply(this, arguments);
                    waiting = true;
                    setTimeout(() => {
                        waiting = false;
                    }, limit);
                }
            };
        }
        
        const throttledLazyLoad = throttle(lazyLoad, 200);
        
        document.addEventListener('scroll', throttledLazyLoad);
        window.addEventListener('resize', throttledLazyLoad);
        window.addEventListener('orientationchange', throttledLazyLoad);
        
        // Initial load
        lazyLoad();
    }
}

// Format date in a readable format
function formatReadableDate(dateString) {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }
    
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return date.toLocaleDateString('en-US', options) + ' IST';
}

// Function to determine reading time
function calculateReadingTime(text) {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    return readingTime === 1 ? '1 minute read' : `${readingTime} minutes read`;
}

// Share functionality
function setupShareButtons() {
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.dataset.platform;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl;
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${title} ${url}`;
                    break;
                default:
                    return;
            }
            
            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupLazyLoading,
        formatReadableDate,
        calculateReadingTime,
        setupShareButtons
    };
} 