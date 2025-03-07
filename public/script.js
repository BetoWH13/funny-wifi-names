document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const generateBtn = document.getElementById('generate-btn');
    const bulkBtn = document.getElementById('bulk-btn');
    const resultContainer = document.getElementById('result-container');
    const singleResult = document.getElementById('single-result');
    const bulkResults = document.getElementById('bulk-results');
    const wifiNameElement = document.getElementById('wifi-name');
    const categoriesContainer = document.getElementById('categories-container');
    const categoryResults = document.getElementById('category-results');
    const categoryTitle = document.getElementById('category-title');
    const categoryNamesContainer = document.getElementById('category-names-container');
    const backToCategoriesBtn = document.getElementById('back-to-categories');
    const copyToast = document.getElementById('copy-toast');
    const currentYearElement = document.getElementById('current-year');
    
    // Set current year in footer
    currentYearElement.textContent = new Date().getFullYear();
    
    // API Endpoints
    const API_BASE = '/.netlify/functions';
    const RANDOM_API = `${API_BASE}/random`;
    const BULK_API = `${API_BASE}/bulk`;
    const CATEGORIES_API = `${API_BASE}/categories`;
    
    // Event Listeners
    generateBtn.addEventListener('click', generateRandomName);
    bulkBtn.addEventListener('click', generateBulkNames);
    backToCategoriesBtn.addEventListener('click', showCategories);
    
    // Load categories on page load
    loadCategories();
    
    // Functions
    async function generateRandomName() {
        try {
            showLoading(wifiNameElement);
            resultContainer.classList.remove('hidden');
            singleResult.classList.remove('hidden');
            bulkResults.classList.add('hidden');
            
            const response = await fetch(RANDOM_API);
            const data = await response.json();
            
            wifiNameElement.textContent = data.name;
            setupCopyButtons();
        } catch (error) {
            wifiNameElement.textContent = 'Error generating name. Please try again.';
            console.error('Error:', error);
        }
    }
    
    async function generateBulkNames() {
        try {
            resultContainer.classList.remove('hidden');
            singleResult.classList.add('hidden');
            bulkResults.classList.remove('hidden');
            bulkResults.innerHTML = '<div class="wifi-name-card"><h3>Loading names...</h3></div>';
            
            const response = await fetch(`${BULK_API}?count=5`);
            const data = await response.json();
            
            displayBulkNames(data.names);
        } catch (error) {
            bulkResults.innerHTML = '<div class="wifi-name-card"><h3>Error loading names. Please try again.</h3></div>';
            console.error('Error:', error);
        }
    }
    
    function displayBulkNames(names) {
        bulkResults.innerHTML = '';
        
        names.forEach(name => {
            const nameCard = document.createElement('div');
            nameCard.className = 'wifi-name-card';
            
            const nameHeading = document.createElement('h3');
            nameHeading.className = 'bulk-wifi-name';
            nameHeading.textContent = name;
            
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
            copyButton.dataset.clipboardText = name;
            
            nameCard.appendChild(nameHeading);
            nameCard.appendChild(copyButton);
            bulkResults.appendChild(nameCard);
        });
        
        setupCopyButtons();
    }
    
    async function loadCategories() {
        if (!categoriesContainer) return; // Skip if the element doesn't exist on this page
        
        try {
            const response = await fetch(CATEGORIES_API);
            const data = await response.json();
            
            displayCategories(data.categories);
        } catch (error) {
            categoriesContainer.innerHTML = '<p>Error loading categories. Please refresh the page.</p>';
            console.error('Error:', error);
        }
    }
    
    function displayCategories(categories) {
        categoriesContainer.innerHTML = '';
        
        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.dataset.category = category.name;
            
            const categoryName = document.createElement('h3');
            categoryName.textContent = capitalizeFirstLetter(category.name);
            
            const categoryCount = document.createElement('p');
            categoryCount.textContent = `${category.count} names`;
            
            categoryCard.appendChild(categoryName);
            categoryCard.appendChild(categoryCount);
            categoriesContainer.appendChild(categoryCard);
            
            // Add click event to load category names
            categoryCard.addEventListener('click', () => loadCategoryNames(category.name));
        });
    }
    
    async function loadCategoryNames(categoryName) {
        try {
            categoryTitle.textContent = `${capitalizeFirstLetter(categoryName)} WiFi Names`;
            categoryNamesContainer.innerHTML = '<div class="wifi-name-card"><h3>Loading names...</h3></div>';
            categoryResults.classList.remove('hidden');
            
            const response = await fetch(`${CATEGORIES_API}?name=${categoryName}`);
            const data = await response.json();
            
            displayCategoryNames(data.names);
        } catch (error) {
            categoryNamesContainer.innerHTML = '<div class="wifi-name-card"><h3>Error loading names. Please try again.</h3></div>';
            console.error('Error:', error);
        }
    }
    
    function displayCategoryNames(names) {
        categoryNamesContainer.innerHTML = '';
        
        names.forEach(name => {
            const nameCard = document.createElement('div');
            nameCard.className = 'wifi-name-card';
            
            const nameHeading = document.createElement('h3');
            nameHeading.textContent = name;
            
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-btn';
            copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
            copyButton.dataset.clipboardText = name;
            
            nameCard.appendChild(nameHeading);
            nameCard.appendChild(copyButton);
            categoryNamesContainer.appendChild(nameCard);
        });
        
        setupCopyButtons();
    }
    
    function showCategories() {
        categoryResults.classList.add('hidden');
    }
    
    function setupCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const textToCopy = this.dataset.clipboardText || 
                                   (this.dataset.clipboardTarget ? 
                                    document.querySelector(this.dataset.clipboardTarget).textContent : '');
                
                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => showToast())
                        .catch(err => console.error('Could not copy text: ', err));
                }
            });
        });
    }
    
    function showToast() {
        copyToast.classList.remove('hidden');
        
        setTimeout(() => {
            copyToast.classList.add('hidden');
        }, 2000);
    }
    
    function showLoading(element) {
        element.textContent = 'Loading...';
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
