document.addEventListener('DOMContentLoaded', function() {
    // Blog posts data
    const blogPosts = [
        {
            id: 1,
            title: 'The Benefits of Ayurvedic Medicine in Modern Healthcare',
            excerpt: 'Explore how ancient Ayurvedic practices are finding relevance in contemporary healthcare systems and benefiting millions worldwide.',
            thumbnail: './images/ayurvedic-medicine.jpg',
            date: '2023-05-19T16:06:00',
            views: 215,
            url: './posts/ayurvedic-medicine-benefits.html'
        },
        {
            id: 2,
            title: 'Understanding Holistic Wellness: Mind, Body, and Spirit',
            excerpt: 'A comprehensive guide to holistic wellness and how it addresses all aspects of human health for optimal well-being.',
            thumbnail: './images/holistic-wellness.jpg',
            date: '2023-05-15T10:30:00',
            views: 178,
            url: './posts/holistic-wellness-guide.html'
        },
        {
            id: 3,
            title: 'New Product Launch: AWPL Herbal Supplements',
            excerpt: 'Introducing our latest range of herbal supplements designed to support immunity, digestion, and overall health.',
            thumbnail: './images/herbal-supplements.jpg',
            date: '2023-05-10T14:20:00',
            views: 320,
            url: './posts/new-herbal-supplements.html'
        }
    ];

    // Function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Function to create a post card
    function createPostCard(post) {
        return `
            <div class="post-card">
                <a href="${post.url}" class="post-thumbnail">
                    <img src="${post.thumbnail}" alt="${post.title}">
                </a>
                <div class="post-content">
                    <h3 class="post-title">
                        <a href="${post.url}">${post.title}</a>
                    </h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-meta">
                        <span class="post-date">${formatDate(post.date)}</span>
                        <span class="view-count">${post.views} views</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Function to display latest posts
    function displayLatestPosts() {
        const latestPostsContainer = document.getElementById('latest-posts-container');
        if (!latestPostsContainer) return;

        // Sort posts by date (newest first)
        const sortedByDate = [...blogPosts].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        // Display the latest posts
        latestPostsContainer.innerHTML = sortedByDate
            .slice(0, 3)
            .map(post => createPostCard(post))
            .join('');
    }

    // Function to display popular posts
    function displayPopularPosts() {
        const popularPostsContainer = document.getElementById('popular-posts-container');
        if (!popularPostsContainer) return;

        // Sort posts by views (most viewed first)
        const sortedByViews = [...blogPosts].sort((a, b) => b.views - a.views);

        // Display the popular posts
        popularPostsContainer.innerHTML = sortedByViews
            .slice(0, 3)
            .map(post => createPostCard(post))
            .join('');
    }

    // Search functionality
    function setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const searchResults = document.getElementById('search-results');
        const searchResultsContainer = document.getElementById('search-results-container');

        if (!searchInput || !searchButton || !searchResults || !searchResultsContainer) return;

        function performSearch() {
            const query = searchInput.value.toLowerCase().trim();
            if (query === '') return;

            // Simple search through titles and excerpts
            const results = blogPosts.filter(post => 
                post.title.toLowerCase().includes(query) || 
                post.excerpt.toLowerCase().includes(query)
            );

            // Display results
            searchResults.style.display = 'block';
            
            if (results.length > 0) {
                searchResultsContainer.innerHTML = results
                    .map(post => createPostCard(post))
                    .join('');
            } else {
                searchResultsContainer.innerHTML = '<p>No results found. Try a different search term.</p>';
            }

            // Scroll to search results
            searchResults.scrollIntoView({ behavior: 'smooth' });
        }

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // View counter functionality for blog posts
    function setupViewCounter() {
        const viewCountElement = document.getElementById('views');
        if (!viewCountElement) return;

        // Get current post URL
        const currentPath = window.location.pathname;
        const postName = currentPath.split('/').pop();

        // Local storage key for this post
        const storageKey = `post_views_${postName}`;

        // Check if this post has been viewed before
        let views = localStorage.getItem(storageKey);
        
        if (views) {
            // Increment view count
            views = parseInt(views) + 1;
        } else {
            // First view
            views = 1;
        }

        // Save updated view count
        localStorage.setItem(storageKey, views);
        
        // Update view count display
        viewCountElement.textContent = views;
    }

    // Initialize functions
    displayLatestPosts();
    displayPopularPosts();
    setupSearch();
    setupViewCounter();
}); 