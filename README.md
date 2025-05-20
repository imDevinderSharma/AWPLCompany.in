# AWPL Blog Website

A clean, modern blog website for Asclepius Wellness Private Limited built with HTML, CSS, and JavaScript.

## Project Overview

This website serves as the company's blog platform, combining a clean, modern, and lightning-fast interface with essential blog features. The site covers articles, product details, and news related to Asclepius Wellness Private Limited.

**Domain:** [https://awplcompany.in/](https://awplcompany.in/)

## Features

- **Latest Posts Section:** Display of most recently published blog posts
- **Popular Posts Section:** Features posts with highest view counts
- **Search Functionality:** Allows users to search through all blog posts
- **Responsive Design:** Mobile-first approach for all devices
- **Performance Optimized:** Fast loading with minimalistic code
- **View Counter:** Tracks and displays view counts for each post
- **Share Buttons:** Easy sharing to social media platforms

## Folder Structure

```
awpl_blog/
 index.html         # Homepage
├── html/             
│   ├── about.html      # About page
│   └── contact.html    # Contact page
├── css/                  
│   └── style.css       # Main styling file
├── js/                   
│   ├── main.js         # Main functionality (search, view counts, etc.)
│   └── utilities.js    # Additional JS utilities
├── posts/                
│   ├── ayurvedic-medicine-benefits.html  # Sample blog post
│   ├── holistic-wellness-guide.html      # Sample blog post
│   └── herbal_supplements_launch.html    # Sample blog post
└── README.md           # This file
```

## Blog Post Guidelines

When creating new blog posts, follow these guidelines:

### File Structure

1. Create a new HTML file in the `posts` directory with a descriptive name (use dashes for spaces, e.g., `new-post-title.html`)
2. Use the existing blog post templates as a reference

### Required Elements

- **Title:** Clear, descriptive title (use H1 tag)
- **Publication Date/Time:** Format as `<time datetime="YYYY-MM-DDThh:mm">Month DD, YYYY, hh:mm IST</time>`
- **Content:** Well-structured with appropriate headings (H2, H3)
- **Images:** Include at least one feature image (720p resolution recommended)
- **View Count Widget:** Include the view counter at the bottom of each post

### HTML Structure Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Post Title - AWPL Blog</title>
    <meta name="description" content="Brief description of the post">
    <link rel="stylesheet" href="../css/style.css">
    <script defer src="../js/main.js"></script>
    <script defer src="../js/utilities.js"></script>
</head>
<body>
    <header class="site-header">
        <!-- Header content -->
    </header>

    <main class="container">
        <article class="blog-post">
            <header class="post-header">
                <h1>Post Title</h1>
                <div class="post-meta-full">
                    <p>Published on: <time datetime="YYYY-MM-DDThh:mm">Month DD, YYYY, hh:mm IST</time> • X minutes read</p>
                </div>
            </header>

            <div class="post-content-full">
                <!-- Blog post content -->
            </div>

            <footer class="post-footer">
                <div class="share-buttons">
                    <p>Share this article:</p>
                    <button class="share-button" data-platform="twitter">Twitter</button>
                    <button class="share-button" data-platform="facebook">Facebook</button>
                    <button class="share-button" data-platform="linkedin">LinkedIn</button>
                    <button class="share-button" data-platform="whatsapp">WhatsApp</button>
                </div>
                <div id="view-count">
                    <span>Views: </span><span id="views">0</span>
                </div>
            </footer>
        </article>
    </main>

    <footer class="site-footer">
        <!-- Footer content -->
    </footer>
</body>
</html>
```

### Best Practices

1. **Image Optimization**
   - Optimize images for web (compress without quality loss)
   - Use descriptive filenames and alt text
   - Recommended dimensions for featured images: 1280x720 pixels

2. **Content Structure**
   - Use clear headings and subheadings
   - Keep paragraphs short and scannable
   - Include lists and blockquotes where appropriate
   - Aim for 800-1500 words per post

3. **SEO Considerations**
   - Include relevant keywords in the title, meta description, and content
   - Use semantic HTML structure
   - Add alt text to all images
   - Include internal links to other relevant posts

## Search Implementation

The search functionality is implemented in `main.js` and works by:

1. Indexing the titles and content of all posts
2. Filtering posts based on user query
3. Displaying results dynamically

To ensure new posts are searchable:

1. Update the `blogPosts` array in `main.js` with the new post information:
   ```javascript
   {
       id: [unique_id],
       title: "Your Post Title",
       excerpt: "Brief excerpt from the post (1-2 sentences)",
       thumbnail: "./images/your-post-thumbnail.jpg",
       date: "YYYY-MM-DDThh:mm:00",
       views: 0,
       url: "./posts/your-post-filename.html"
   }
   ```

## View Count System

The view counter uses the browser's localStorage to track views:

1. When a user visits a post, the script checks if they've viewed it before
2. If not, it initializes a counter; if yes, it increments the existing count
3. The count is displayed at the bottom of each post

## Performance Optimization

The website is optimized for performance through:

1. Minimal CSS and JavaScript
2. Lazy loading of images using the `utilities.js` script
3. Minified code (in production)
4. Efficient DOM manipulation

## Future Enhancements

Potential future improvements include:

1. **Backend Integration:** Move to a database-driven system for easier content management
2. **Comments System:** Allow users to comment on posts
3. **Newsletter Subscription:** Add email capture for newsletter distribution
4. **Related Posts:** Suggest related content at the end of each post
5. **Categories and Tags:** Add more structured organization to posts

## License

Copyright © 2023 Asclepius Wellness Private Limited. All rights reserved. 