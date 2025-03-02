document.addEventListener('DOMContentLoaded', function() {
    // Get all blog posts
    const blogPostsContainer = document.getElementById('blog-posts-container');
    const allBlogPosts = Array.from(blogPostsContainer.getElementsByClassName('blog-post'));
    const categoryLinks = document.querySelectorAll('.categories-widget a');
    
    // Get category from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    
    if (categoryFromUrl) {
        filterPostsByCategory(categoryFromUrl);
        updateActiveCategory(categoryFromUrl);
    }
    
    // Add click event listeners to category links
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get category from href
            const category = this.getAttribute('href').split('/')[2];
            
            // Update URL without page reload
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('category', category);
            window.history.pushState({}, '', newUrl);
            
            filterPostsByCategory(category);
            updateActiveCategory(category);
        });
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            filterPostsByCategory(category);
            updateActiveCategory(category);
        } else {
            // Show all posts if no category is selected
            showAllPosts();
            updateActiveCategory(null);
        }
    });
    
    function filterPostsByCategory(category) {
        allBlogPosts.forEach(post => {
            const postCategory = post.querySelector('.post-category').textContent.toLowerCase();
            if (category.toLowerCase() === postCategory) {
                post.style.display = '';
                // Add a smooth fade-in animation
                post.style.opacity = '0';
                requestAnimationFrame(() => {
                    post.style.transition = 'opacity 0.3s ease-in';
                    post.style.opacity = '1';
                });
            } else {
                post.style.display = 'none';
            }
        });
        
        // Update the intro section
        updateIntroSection(category);
    }
    
    function showAllPosts() {
        allBlogPosts.forEach(post => {
            post.style.display = '';
            post.style.opacity = '1';
        });
        
        // Reset the intro section
        updateIntroSection(null);
    }
    
    function updateActiveCategory(category) {
        // Remove active class from all category links
        categoryLinks.forEach(link => link.classList.remove('active'));
        
        if (category) {
            // Add active class to selected category
            const activeLink = Array.from(categoryLinks).find(link => 
                link.getAttribute('href').includes(category.toLowerCase())
            );
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    function updateIntroSection(category) {
        const introTitle = document.querySelector('.blog-intro h2');
        const introText = document.querySelector('.blog-intro p');
        
        if (!category) {
            introTitle.textContent = 'Welcome to Our Blog';
            introText.textContent = 'Discover humorous articles, tips, and stories about WiFi names, network security, and internet culture. Our blog is updated regularly with fresh content to keep you entertained and informed.';
            return;
        }
        
        const categoryTitles = {
            'humor': 'Humor Category',
            'security': 'Security Category',
            'puns': 'Puns Category',
            'movies': 'Movies Category',
            'tech': 'Tech Category',
            'warnings': 'Warnings Category'
        };
        
        const categoryDescriptions = {
            'humor': 'Enjoy our collection of humorous articles about funny WiFi names and network pranks that will make you laugh.',
            'security': 'Learn about network security best practices while keeping your WiFi name entertaining.',
            'puns': 'Discover our collection of clever wordplay and puns perfect for your WiFi network name.',
            'movies': 'Find the perfect movie-inspired WiFi name from our collection of film references.',
            'tech': 'Explore tech-savvy WiFi names that showcase your inner geek.',
            'warnings': 'Browse our collection of warning-themed WiFi names that will make your neighbors think twice.'
        };
        
        introTitle.textContent = categoryTitles[category.toLowerCase()] || `${category} Category`;
        introText.textContent = categoryDescriptions[category.toLowerCase()] || `Showing all posts in the ${category} category.`;
    }
});
