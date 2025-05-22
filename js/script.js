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

    // Responsive Menu Toggle with enhanced animations
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    
    const nav = document.querySelector('nav .container');
    const menu = document.querySelector('.menu');
    
    if (nav && menu) {
        nav.insertBefore(menuToggle, menu);
        
        // Optimize menu interactions
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            this.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside - delegated event handler for better performance
        document.addEventListener('click', function(event) {
            if (menu.classList.contains('active') && 
                !event.target.closest('.menu') && 
                !event.target.closest('.menu-toggle')) {
                menu.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when escape key is pressed
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                menu.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Event delegation for menu clicks - more efficient than multiple listeners
        menu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && window.innerWidth <= 768) {
                menu.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Debounced resize handler
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768 && menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }, 100);
        });
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