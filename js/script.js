document.addEventListener('DOMContentLoaded', function() {
    // Performance optimizations
    let isScrolling;
    const header = document.querySelector('header');
    
    // Scroll effect for header - optimized with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.scrollY > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Responsive Menu Toggle with enhanced animations and touch support
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    const nav = document.querySelector('nav .container');
    const menu = document.querySelector('.menu');
    
    if (nav && menu && menuToggle && menuOverlay) {
        // Function to toggle menu
        function toggleMenu() {
            const isActive = menuToggle.classList.contains('active');
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        }
        
        // Function to open menu
        function openMenu() {
            menuToggle.classList.add('active');
            menu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.classList.add('menu-open');
            
            // Store current scroll position
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            
            // Add focus trap for accessibility
            menuToggle.focus();
        }
        
        // Function to close menu
        function closeMenu() {
            menuToggle.classList.remove('active');
            menu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        
        // Handle menu toggle click
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleMenu();
        });
        
        // Handle keyboard navigation for menu toggle
        menuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        
        // Handle overlay click to close menu
        menuOverlay.addEventListener('click', function() {
            closeMenu();
        });
        
        // Close menu when clicking outside - improved logic
        document.addEventListener('click', function(event) {
            if (menu.classList.contains('active') && 
                !event.target.closest('.menu') && 
                !event.target.closest('.menu-toggle')) {
                closeMenu();
            }
        });
        
        // Close menu when escape key is pressed
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Event delegation for menu clicks - close menu when link is clicked
        menu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && window.innerWidth <= 768) {
                closeMenu();
            }
        });
        
        // Enhanced resize handler with debouncing
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768 && menu.classList.contains('active')) {
                    closeMenu();
                }
            }, 100);
        });
        
        // Enhanced touch handling to prevent accidental menu activation
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let isScrolling = false;
        
        // Prevent accidental menu activation from swipe gestures
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            isScrolling = false;
        }, { passive: true });
        
        document.addEventListener('touchmove', function(e) {
            if (!menu.classList.contains('active')) {
                const touchCurrentX = e.touches[0].clientX;
                const touchCurrentY = e.touches[0].clientY;
                const deltaX = touchCurrentX - touchStartX;
                const deltaY = touchCurrentY - touchStartY;
                const absDeltaX = Math.abs(deltaX);
                const absDeltaY = Math.abs(deltaY);
                
                // Determine if this is a horizontal swipe or vertical scroll
                if (!isScrolling) {
                    isScrolling = absDeltaY > absDeltaX;
                }
                
                // If this is clearly a horizontal swipe from the right edge, prevent any interference
                if (absDeltaX > 30 && absDeltaX > absDeltaY && touchStartX > window.innerWidth - 50) {
                    // This is a horizontal swipe from the right edge, prevent any menu activation
                    e.preventDefault();
                }
            }
        }, { passive: false });
        
        // Add specific handling for the navigation area
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.addEventListener('touchstart', function(e) {
                // Allow normal touch interactions within the header
                e.stopPropagation();
            }, { passive: true });
        }
    }

    // Enhanced image lazy loading with Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    if (image.dataset.src) {
                        // Create a new image to preload
                        const img = new Image();
                        
                        // Set up load event before setting src
                        img.onload = function() {
                            // Once image is loaded, update the src and add loaded class
                            image.src = image.dataset.src;
                            image.classList.add('loaded');
                            image.removeAttribute('data-src');
                        };
                        
                        // Set the src to begin loading
                        img.src = image.dataset.src;
                    }
                    observer.unobserve(image);
                }
            });
        }, {
            rootMargin: '200px 0px', // Start loading images before they appear in viewport
            threshold: 0.01 // Trigger when even 1% of the element is visible
        });
        
        // Apply lazy loading to all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            // Only observe images that aren't already loaded
            if (!img.classList.contains('loaded')) {
                imageObserver.observe(img);
            }
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
    
    // Add animation to elements when they come into view - optimized for performance
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Use requestAnimationFrame to optimize UI updates
                    requestAnimationFrame(() => {
                        entry.target.classList.add('animated');
                    });
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            animationObserver.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            element.classList.add('animated');
        });
    }
});

// Load non-critical resources after page load
window.addEventListener('load', function() {
    // Preload remaining resources
    setTimeout(() => {
        // Load any deferred scripts or resources here
        
        // Initialize any non-critical features
        initializeNonCriticalFeatures();
    }, 100); // Small delay to ensure main content is interactive first
});

// Non-critical features initialization
function initializeNonCriticalFeatures() {
    // FAQ Accordion functionality - moved to non-critical
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('h3');
            const answer = item.querySelector('p');
            
            if (answer && question) {
                answer.style.display = 'none';
                
                question.addEventListener('click', () => {
                    const isOpen = answer.style.display === 'block';
                    question.classList.toggle('active', !isOpen);
                    
                    if (isOpen) {
                        answer.style.display = 'none';
                    } else {
                        answer.style.display = 'block';
                    }
                    
                    // Close other answers
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherQuestion = otherItem.querySelector('h3');
                            const otherAnswer = otherItem.querySelector('p');
                            
                            if (otherAnswer && otherAnswer.style.display === 'block') {
                                otherQuestion.classList.remove('active');
                                otherAnswer.style.display = 'none';
                            }
                        }
                    });
                });
            }
        });
    }
    
    // Initialize share buttons if they exist
    const shareButtons = document.querySelectorAll('.social-share a');
    
    if (shareButtons.length > 0) {
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const postTitle = document.querySelector('.post-header h1')?.textContent || document.title;
                const postUrl = window.location.href;
                
                let shareUrl;
                
                if (this.classList.contains('facebook')) {
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                } else if (this.classList.contains('twitter')) {
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`;
                } else if (this.classList.contains('linkedin')) {
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
                } else if (this.classList.contains('whatsapp')) {
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(postTitle + ' ' + postUrl)}`;
                } else if (this.classList.contains('telegram')) {
                    shareUrl = `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }
}

// Preload critical resources
window.addEventListener('load', function() {
    // Preconnect to external domains
    const domains = ['https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'];
    
    domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
    });
}); 