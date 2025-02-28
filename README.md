# Funny WiFi Names Generator

A simple web application that generates funny and creative WiFi network names. Perfect for adding some humor to your wireless network!

## Features

- Generate random funny WiFi names
- Browse WiFi names by categories
- Get multiple suggestions at once
- Copy names to clipboard with a single click
- Read entertaining blog posts about WiFi names and network humor

## Technologies Used

- HTML, CSS, and JavaScript for the frontend
- Netlify Functions for serverless backend
- JSON data store for WiFi names

## Project Structure

```
/funny-wifi-names
 ├── /api              # Netlify API functions (backend)
 │   ├── random.js     # API to return a random WiFi name
 │   ├── bulk.js       # API to return multiple WiFi names
 │   ├── categories.js # API to return WiFi names by category
 ├── /public           # Website static assets
 │   ├── index.html    # Home page (Funny WiFi Name Generator)
 │   ├── styles.css    # CSS styles
 │   ├── script.js     # JavaScript for button interaction
 │   ├── robots.txt    # Search engine crawling instructions
 │   ├── sitemap.xml   # Site structure for search engines
 │   ├── /blog         # Blog section
 │   │   ├── index.html   # Blog home page
 │   │   ├── blog.css     # Blog-specific styles
 │   │   ├── /posts       # Individual blog posts
 │   │   │   ├── post.css # Blog post styles
 │   │   │   ├── wifi-neighbors-communication.html # Sample post
 │   │   ├── /category    # Category archive pages
 │   │   ├── /page        # Pagination pages
 ├── /data
 │   ├── wifi-names.json  # JSON file with all funny WiFi names
 ├── netlify.toml      # Netlify configuration
 ├── package.json      # Project dependencies and scripts
 ├── build.js          # Build script for preparing functions
 ├── README.md         # Project documentation
```

## Building and Running Locally

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone this repository
   ```
   git clone https://github.com/yourusername/funny-wifi-names.git
   cd funny-wifi-names
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Build the project
   ```
   npm run build
   ```

4. Start the local development server
   ```
   npm start
   ```

5. Open your browser to `http://localhost:8888`

## Preparing for Deployment

1. Build the project to prepare the functions directory
   ```
   npm run build
   ```

2. Initialize a Git repository (if not already done)
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. Create a repository on GitHub and push your code
   ```
   git remote add origin https://github.com/yourusername/funny-wifi-names.git
   git push -u origin main
   ```

4. When ready to deploy to a hosting service:
   - For GitHub Pages: Configure to serve from the `public` directory
   - For Netlify/Vercel: Connect your GitHub repository and configure build settings

## API Endpoints

- `/api/random` - Get a random WiFi name
- `/api/bulk?count=5` - Get multiple WiFi names (specify count)
- `/api/categories` - Get all available categories
- `/api/categories?name=food` - Get WiFi names from a specific category

## Blog Section

The blog section provides entertaining and informative content related to WiFi names, network security, and internet humor. Features include:

- Text-based content optimized for fast loading
- Categorized blog posts
- Social sharing capabilities
- Related posts suggestions
- Mobile-responsive design

### Blog Structure

- `/blog/index.html` - Main blog listing page with recent posts
- `/blog/posts/` - Individual blog post pages
- `/blog/category/` - Category archive pages
- `/blog/page/` - Pagination for blog listings

## License

MIT
