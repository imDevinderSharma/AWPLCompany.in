document.addEventListener('DOMContentLoaded', function() {
    // Performance optimizations
    let isScrolling;
    const header = document.querySelector('header');
    
    // Scroll effect for header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Throttle intensive operations during scroll
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(function() {
            // Perform any intensive operations after scrolling stops
        }, 100);
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
        
        // Add animation delay to menu items
        const menuItems = menu.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.transitionDelay = `${0.05 * index}s`;
        });
        
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            this.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.classList.toggle('menu-open'); // Add class to body to prevent scrolling when menu is open
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.menu') && !event.target.closest('.menu-toggle')) {
                if (menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
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
        
        // Close menu when a menu item is clicked (mobile)
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    menu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });
        
        // Handle resize events - debounced for performance
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

    // FAQ Accordion functionality with smooth animations
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        // Initially hide answers
        if (answer) {
            answer.style.display = 'none';
            
            // Add click event to questions
            question.addEventListener('click', () => {
                // Toggle current answer
                const isOpen = answer.style.display === 'block';
                
                // Toggle plus/minus icon
                question.classList.toggle('active', !isOpen);
                
                // Slide toggle animation
                if (isOpen) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    setTimeout(() => {
                        answer.style.maxHeight = '0px';
                        setTimeout(() => {
                            answer.style.display = 'none';
                        }, 300);
                    }, 10);
                } else {
                    answer.style.display = 'block';
                    answer.style.maxHeight = '0px';
                    setTimeout(() => {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }, 10);
                }
                
                // Close other answers
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherQuestion = otherItem.querySelector('h3');
                        const otherAnswer = otherItem.querySelector('p');
                        
                        if (otherAnswer && otherAnswer.style.display === 'block') {
                            otherQuestion.classList.remove('active');
                            otherAnswer.style.maxHeight = otherAnswer.scrollHeight + 'px';
                            setTimeout(() => {
                                otherAnswer.style.maxHeight = '0px';
                                setTimeout(() => {
                                    otherAnswer.style.display = 'none';
                                }, 300);
                            }, 10);
                        }
                    }
                });
            });
        }
    });
    
    // Image lazy loading with Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    // Only replace src if we have a data-src attribute
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                        image.removeAttribute('data-src');
                        image.classList.add('loaded');
                    }
                    observer.unobserve(image);
                }
            });
        }, {
            rootMargin: '0px 0px 200px 0px' // Start loading images before they appear in viewport
        });
        
        // Setup lazy loading for all images on the page
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Share functionality
    const shareButtons = document.querySelectorAll('.social-share a');
    
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
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    // Add animation to elements when they come into view
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
});

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