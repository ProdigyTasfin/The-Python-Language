// E-Commerce Product Search System - Complete Frontend
class ProductSearchApp {
    constructor() {
        this.baseUrl = window.location.origin;
        this.products = [];
        this.graph = {};
        this.selectedProduct = null;
        this.searchResults = [];
        this.recommendationPath = [];
        this.stats = {
            searches: 0,
            matches: 0,
            recommendations: 0,
            startTime: Date.now()
        };
        
        this.initialize();
    }

    async initialize() {
        console.log('🚀 Initializing Product Search System...');
        
        // Initialize components
        this.setupEventListeners();
        this.setupTheme();
        this.setupCanvas();
        
        // Load data from API
        await this.loadProducts();
        await this.loadGraph();
        
        // Initialize UI
        this.updateProductDisplay();
        this.updateStats();
        this.startClock();
        
        // Show welcome notification
        this.showNotification('System Ready', 'Product search system initialized successfully!', 'success');
        
        console.log('✅ System initialized successfully');
    }

    // API Communication
    async fetchAPI(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            this.showNotification('API Error', 'Failed to connect to the server', 'error');
            throw error;
        }
    }

    async loadProducts() {
        try {
            this.showLoading('Loading products...');
            const data = await this.fetchAPI('/api/products');
            
            if (data.success) {
                this.products = data.products;
                this.updateProductSelect();
                this.updateProductCount();
                console.log(`📦 Loaded ${this.products.length} products`);
            }
        } catch (error) {
            console.error('Failed to load products:', error);
            // Fallback to default products
            this.products = this.getDefaultProducts();
        } finally {
            this.hideLoading();
        }
    }

    async loadGraph() {
        try {
            const data = await this.fetchAPI('/api/graph');
            
            if (data.success) {
                this.graph = data.graph;
                console.log(`📊 Loaded graph with ${Object.keys(this.graph).length} nodes`);
                this.drawGraph();
            }
        } catch (error) {
            console.error('Failed to load graph:', error);
            // Fallback to default graph
            this.graph = this.getDefaultGraph();
            this.drawGraph();
        }
    }

    // KMP Search
    async performSearch() {
        const searchText = document.getElementById('productsText').value;
        const pattern = document.getElementById('searchPattern').value.trim();
        
        if (!pattern) {
            this.showNotification('Search Error', 'Please enter a search pattern', 'warning');
            return;
        }
        
        try {
            this.showLoading(`Searching for "${pattern}"...`);
            
            const data = await this.fetchAPI('/api/search', {
                method: 'POST',
                body: JSON.stringify({
                    text: searchText,
                    pattern: pattern
                })
            });
            
            if (data.success) {
                this.searchResults = data.results;
                this.displaySearchResults(data);
                this.stats.searches++;
                this.stats.matches += data.total_matches;
                this.updateStats();
                
                this.showNotification('Search Complete', 
                    `Found ${data.found_products} products with ${data.total_matches} matches`, 
                    'success');
            }
        } catch (error) {
            console.error('Search failed:', error);
            this.showNotification('Search Failed', 'An error occurred during search', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Graph Algorithms
    async runBFS() {
        if (!this.selectedProduct) {
            this.showNotification('Selection Required', 'Please select a product first', 'warning');
            return;
        }
        
        try {
            this.showLoading('Running BFS algorithm...');
            
            const data = await this.fetchAPI(`/api/recommend/bfs/${this.selectedProduct.id}`);
            
            if (data.success) {
                this.recommendationPath = data.path;
                this.displayRecommendationPath(data, 'BFS');
                this.stats.recommendations++;
                this.updateStats();
            }
        } catch (error) {
            console.error('BFS failed:', error);
            this.showNotification('Algorithm Failed', 'BFS algorithm encountered an error', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async runDFS() {
        if (!this.selectedProduct) {
            this.showNotification('Selection Required', 'Please select a product first', 'warning');
            return;
        }
        
        try {
            this.showLoading('Running DFS algorithm...');
            
            const data = await this.fetchAPI(`/api/recommend/dfs/${this.selectedProduct.id}`);
            
            if (data.success) {
                this.recommendationPath = data.path;
                this.displayRecommendationPath(data, 'DFS');
                this.stats.recommendations++;
                this.updateStats();
            }
        } catch (error) {
            console.error('DFS failed:', error);
            this.showNotification('Algorithm Failed', 'DFS algorithm encountered an error', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // UI Updates
    updateProductDisplay() {
        const container = document.getElementById('productsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        const filterText = document.getElementById('productFilter').value.toLowerCase();
        const filterCategory = document.getElementById('categoryFilter').value;
        
        this.products.forEach(product => {
            // Apply filters
            if (filterText && !product.name.toLowerCase().includes(filterText) && 
                !product.category.toLowerCase().includes(filterText)) {
                return;
            }
            
            if (filterCategory && product.category !== filterCategory) {
                return;
            }
            
            const isSelected = this.selectedProduct && this.selectedProduct.id === product.id;
            
            const productCard = document.createElement('div');
            productCard.className = `product-card ${isSelected ? 'selected' : ''}`;
            productCard.innerHTML = `
                <div class="product-id">${product.id}</div>
                <i class="fas ${this.getProductIcon(product.category)}"></i>
                <h4>${this.escapeHtml(product.name)}</h4>
                <div class="category">${product.category}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">
                    ${this.generateStars(product.rating)}
                    <small>${product.rating.toFixed(1)}</small>
                </div>
            `;
            
            productCard.addEventListener('click', () => this.selectProduct(product));
            
            container.appendChild(productCard);
        });
    }

    updateProductSelect() {
        const select = document.getElementById('selectedProduct');
        if (!select) return;
        
        select.innerHTML = '<option value="">Choose a product...</option>';
        
        this.products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} (${product.category})`;
            select.appendChild(option);
        });
        
        // Update preview
        this.updateProductPreview();
    }

    updateProductPreview() {
        const preview = document.getElementById('selectedProductPreview');
        if (!preview) return;
        
        if (this.selectedProduct) {
            preview.innerHTML = `
                <i class="fas ${this.getProductIcon(this.selectedProduct.category)}"></i>
                <div>
                    <strong>${this.selectedProduct.name}</strong>
                    <small>${this.selectedProduct.category} • $${this.selectedProduct.price.toFixed(2)}</small>
                </div>
            `;
        } else {
            preview.innerHTML = `
                <i class="fas fa-question-circle"></i>
                <span>No product selected</span>
            `;
        }
    }

    updateProductCount() {
        const countElement = document.getElementById('productCount');
        if (countElement) {
            countElement.textContent = `${this.products.length} products`;
        }
    }

    updateStats() {
        document.getElementById('totalSearches').textContent = this.stats.searches;
        document.getElementById('totalMatches').textContent = this.stats.matches;
        document.getElementById('totalRecommendations').textContent = this.stats.recommendations;
        document.getElementById('matchCount').textContent = `${this.stats.matches} matches`;
    }

    // Display Functions
    displaySearchResults(data) {
        const container = document.getElementById('searchResults');
        if (!container) return;
        
        if (!data.results || data.results.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No Results Found</h3>
                    <p>Pattern "${this.escapeHtml(data.pattern)}" not found in any product</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="search-summary">
                <h3><i class="fas fa-check-circle"></i> Search Results</h3>
                <p>Found <strong>${data.found_products}</strong> products with <strong>${data.total_matches}</strong> matches for pattern: <code>${this.escapeHtml(data.pattern)}</code></p>
            </div>
        `;
        
        data.results.forEach(result => {
            const product = result.product;
            const highlighted = this.highlightMatches(product, data.pattern, result.matches);
            
            html += `
                <div class="search-result">
                    <div class="search-result-header">
                        <h4><i class="fas fa-box"></i> Product #${result.index + 1}</h4>
                        <span class="match-badge">${result.match_count} match${result.match_count > 1 ? 'es' : ''}</span>
                    </div>
                    <div class="product-name">${this.escapeHtml(product)}</div>
                    <div class="highlighted-text">${highlighted}</div>
                    <div class="match-positions">
                        <i class="fas fa-bullseye"></i>
                        Positions: ${result.matches.join(', ')}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    displayRecommendationPath(data, algorithm) {
        const container = document.getElementById('recommendationResults');
        if (!container) return;
        
        if (!data.path || data.path.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-route"></i>
                    <h3>No Path Found</h3>
                    <p>No recommendation path available for the selected product</p>
                </div>
            `;
            return;
        }
        
        const startProduct = this.products.find(p => p.id === data.start_product);
        
        let html = `
            <div class="path-container">
                <div class="path-header">
                    <h3><i class="fas ${algorithm === 'BFS' ? 'fa-expand-arrows-alt' : 'fa-code-branch'}"></i> ${algorithm} Recommendations</h3>
                    <span class="path-length">${data.path_length} products</span>
                </div>
                <p>Starting from: <strong>${startProduct?.name || 'Unknown'}</strong></p>
                
                <div class="path-items">
        `;
        
        data.path.forEach((nodeId, index) => {
            const product = this.products.find(p => p.id === nodeId);
            if (!product) return;
            
            const isStart = nodeId === data.start_product;
            const isLast = index === data.path.length - 1;
            
            html += `
                <div class="path-item ${isStart ? 'active' : ''}" onclick="app.selectProductById(${nodeId})">
                    <i class="fas ${this.getProductIcon(product.category)}"></i>
                    <div>
                        <strong>${product.name}</strong>
                        <small>${product.category}</small>
                    </div>
                    ${isStart ? '<span class="path-badge">Start</span>' : ''}
                </div>
            `;
            
            if (!isLast) {
                html += `<span class="path-arrow"><i class="fas fa-arrow-right"></i></span>`;
            }
        });
        
        html += `
                </div>
                
                <div class="path-stats">
                    <div class="path-stat">
                        <span>${data.path_length}</span>
                        <small>Total Nodes</small>
                    </div>
                    <div class="path-stat">
                        <span>${data.unique_products}</span>
                        <small>Unique Products</small>
                    </div>
                    <div class="path-stat">
                        <span>${algorithm}</span>
                        <small>Algorithm</small>
                    </div>
                    <div class="path-stat">
                        <span>${this.selectedProduct?.name || 'N/A'}</span>
                        <small>Start Product</small>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Update graph with highlighted path
        this.drawGraph(data.path);
    }

    // Canvas Graph
    setupCanvas() {
        this.canvas = document.getElementById('productGraph');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Make responsive
        this.makeCanvasResponsive();
        window.addEventListener('resize', () => {
            this.makeCanvasResponsive();
            this.drawGraph();
        });
    }

    makeCanvasResponsive() {
        if (!this.canvas) return;
        
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        
        // Maintain aspect ratio
        const aspectRatio = 800 / 400;
        const newWidth = Math.min(containerWidth, 800);
        const newHeight = newWidth / aspectRatio;
        
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        this.canvas.style.width = `${newWidth}px`;
        this.canvas.style.height = `${newHeight}px`;
    }

    drawGraph(highlightedPath = []) {
        if (!this.canvas || !this.ctx) return;
        
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--light-card').trim();
        if (document.body.classList.contains('dark-theme')) {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--dark-card').trim();
        }
        ctx.fillRect(0, 0, width, height);
        
        const nodeCount = Object.keys(this.graph).length;
        if (nodeCount === 0) return;
        
        // Calculate node positions (circular layout)
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) * 0.7;
        const nodeRadius = Math.min(20, radius * 0.1);
        
        const nodePositions = {};
        Object.keys(this.graph).forEach((nodeId, index) => {
            const angle = (index / nodeCount) * 2 * Math.PI;
            nodePositions[nodeId] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
                angle: angle
            };
        });
        
        // Draw edges
        Object.entries(this.graph).forEach(([fromNode, neighbors]) => {
            const fromPos = nodePositions[fromNode];
            
            neighbors.forEach(toNode => {
                const toPos = nodePositions[toNode];
                
                // Check if this edge is in the highlighted path
                const isHighlighted = highlightedPath.includes(parseInt(fromNode)) && 
                                     highlightedPath.includes(parseInt(toNode));
                
                const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
                const adjustedToX = toPos.x - nodeRadius * Math.cos(angle);
                const adjustedToY = toPos.y - nodeRadius * Math.sin(angle);
                
                // Edge line
                ctx.beginPath();
                ctx.moveTo(fromPos.x, fromPos.y);
                ctx.lineTo(adjustedToX, adjustedToY);
                ctx.strokeStyle = isHighlighted ? '#ff6b6b' : 'rgba(74, 111, 165, 0.3)';
                ctx.lineWidth = isHighlighted ? 3 : 1.5;
                ctx.stroke();
                
                // Arrowhead
                if (!isHighlighted) {
                    ctx.beginPath();
                    ctx.moveTo(adjustedToX, adjustedToY);
                    ctx.lineTo(
                        adjustedToX - 8 * Math.cos(angle - Math.PI / 6),
                        adjustedToY - 8 * Math.sin(angle - Math.PI / 6)
                    );
                    ctx.lineTo(
                        adjustedToX - 8 * Math.cos(angle + Math.PI / 6),
                        adjustedToY - 8 * Math.sin(angle + Math.PI / 6)
                    );
                    ctx.closePath();
                    ctx.fillStyle = 'rgba(74, 111, 165, 0.5)';
                    ctx.fill();
                }
            });
        });
        
        // Draw nodes
        Object.entries(nodePositions).forEach(([nodeId, pos]) => {
            const product = this.products.find(p => p.id === parseInt(nodeId));
            if (!product) return;
            
            const isSelected = this.selectedProduct && this.selectedProduct.id === parseInt(nodeId);
            const isInPath = highlightedPath.includes(parseInt(nodeId));
            const isStart = highlightedPath.length > 0 && highlightedPath[0] === parseInt(nodeId);
            
            // Node circle
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
            
            if (isStart) {
                ctx.fillStyle = '#4fc3a1';
            } else if (isInPath) {
                ctx.fillStyle = '#ff6b6b';
            } else if (isSelected) {
                ctx.fillStyle = '#ff9800';
            } else {
                ctx.fillStyle = '#4a6fa5';
            }
            
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Node label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const label = product.name.substring(0, 4);
            ctx.fillText(label, pos.x, pos.y);
            
            // Node ID
            ctx.fillStyle = '#666666';
            ctx.font = '10px Arial';
            ctx.fillText(nodeId, pos.x, pos.y + nodeRadius + 12);
        });
    }

    // Utility Functions
    selectProduct(product) {
        this.selectedProduct = product;
        this.updateProductDisplay();
        this.updateProductPreview();
        
        // Update select element
        const select = document.getElementById('selectedProduct');
        if (select) {
            select.value = product.id;
        }
        
        // Show notification
        this.showNotification('Product Selected', `Selected: ${product.name}`, 'info');
        
        // Redraw graph with selected node
        this.drawGraph();
    }

    selectProductById(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.selectProduct(product);
        }
    }

    getProductIcon(category) {
        const icons = {
            'Electronics': 'fa-laptop',
            'Audio': 'fa-headphones',
            'Wearables': 'fa-clock',
            'Office': 'fa-print',
            'Accessories': 'fa-keyboard'
        };
        return icons[category] || 'fa-box';
    }

    generateStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    highlightMatches(text, pattern, matches) {
        if (!matches || matches.length === 0) return this.escapeHtml(text);
        
        let result = '';
        let lastIndex = 0;
        
        matches.forEach(match => {
            // Add text before match
            result += this.escapeHtml(text.substring(lastIndex, match));
            
            // Add highlighted match
            result += `<span class="highlight">${this.escapeHtml(text.substring(match, match + pattern.length))}</span>`;
            
            lastIndex = match + pattern.length;
        });
        
        // Add remaining text
        result += this.escapeHtml(text.substring(lastIndex));
        
        return result;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading(message = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        const messageEl = document.getElementById('loadingMessage');
        
        if (overlay && messageEl) {
            messageEl.textContent = message;
            overlay.classList.add('active');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    showNotification(title, message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <div class="notification-content">
                <h4>${this.escapeHtml(title)}</h4>
                <p>${this.escapeHtml(message)}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        // Check for saved theme or prefer dark mode
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
            
            // Redraw graph with new theme
            this.drawGraph();
        });
    }

    startClock() {
        const updateTime = () => {
            const now = new Date();
            const serverTime = document.getElementById('serverTime');
            const uptime = document.getElementById('uptime');
            
            if (serverTime) {
                serverTime.textContent = now.toLocaleTimeString();
            }
            
            if (uptime) {
                const uptimeMs = Date.now() - this.stats.startTime;
                const hours = Math.floor(uptimeMs / 3600000);
                const minutes = Math.floor((uptimeMs % 3600000) / 60000);
                const seconds = Math.floor((uptimeMs % 60000) / 1000);
                uptime.textContent = `Uptime: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Event Listeners
    setupEventListeners() {
        // Search
        document.getElementById('searchBtn')?.addEventListener('click', () => this.performSearch());
        document.getElementById('searchPattern')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        
        // Clear search
        document.getElementById('clearSearch')?.addEventListener('click', () => {
            document.getElementById('searchPattern').value = '';
            document.getElementById('searchResults').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No Search Results</h3>
                    <p>Enter a search pattern to find matching products</p>
                </div>
            `;
            this.showNotification('Search Cleared', 'Search results have been cleared', 'info');
        });
        
        // Load sample
        document.getElementById('loadSample')?.addEventListener('click', () => {
            document.getElementById('productsText').value = 
                'Laptop, Smartphone, Headphones, Camera, Smartwatch, Printer, Tablet, Keyboard, Monitor, Mouse, Gaming Console, Speaker, Drone, VR Headset, Smart TV, Router, Hard Drive, SSD, Webcam, Microphone';
            this.showNotification('Sample Loaded', 'Sample product database loaded', 'success');
        });
        
        // Algorithms
        document.getElementById('runBFS')?.addEventListener('click', () => this.runBFS());
        document.getElementById('runDFS')?.addEventListener('click', () => this.runDFS());
        
        // Product selection
        document.getElementById('selectedProduct')?.addEventListener('change', (e) => {
            const productId = parseInt(e.target.value);
            if (!isNaN(productId)) {
                this.selectProductById(productId);
            }
        });
        
        // Filters
        document.getElementById('productFilter')?.addEventListener('input', () => this.updateProductDisplay());
        document.getElementById('categoryFilter')?.addEventListener('change', () => this.updateProductDisplay());
        
        // Redraw graph
        document.getElementById('redrawGraph')?.addEventListener('click', () => {
            this.drawGraph();
            this.showNotification('Graph Updated', 'Product relationship graph redrawn', 'info');
        });
        
        // API connection
        document.getElementById('connectApi')?.addEventListener('click', async () => {
            try {
                this.showLoading('Testing API connection...');
                const data = await this.fetchAPI('/api/system/info');
                
                if (data.success) {
                    this.showNotification('API Connected', 
                        `Connected to ${data.system} v${data.version}`, 
                        'success');
                }
            } catch (error) {
                this.showNotification('API Disconnected', 
                    'Failed to connect to the API server', 
                    'error');
            } finally {
                this.hideLoading();
            }
        });
        
        // Real-time search toggle
        document.getElementById('realTimeSearch')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.showNotification('Real-time Search Enabled', 
                    'Search will update as you type', 
                    'info');
            }
        });
    }

    // Default Data (fallback)
    getDefaultProducts() {
        return [
            { id: 0, name: "Laptop", category: "Electronics", price: 999.99, rating: 4.5 },
            { id: 1, name: "Smartphone", category: "Electronics", price: 699.99, rating: 4.7 },
            { id: 2, name: "Headphones", category: "Audio", price: 199.99, rating: 4.3 },
            { id: 3, name: "Camera", category: "Electronics", price: 599.99, rating: 4.6 },
            { id: 4, name: "Smartwatch", category: "Wearables", price: 299.99, rating: 4.4 },
            { id: 5, name: "Printer", category: "Office", price: 149.99, rating: 4.2 },
            { id: 6, name: "Tablet", category: "Electronics", price: 399.99, rating: 4.5 },
            { id: 7, name: "Keyboard", category: "Accessories", price: 89.99, rating: 4.1 },
            { id: 8, name: "Monitor", category: "Electronics", price: 249.99, rating: 4.4 },
            { id: 9, name: "Mouse", category: "Accessories", price: 49.99, rating: 4.0 }
        ];
    }

    getDefaultGraph() {
        return {
            0: [1, 2, 8],
            1: [3, 4, 6],
            2: [0, 1, 9],
            3: [1, 6, 8],
            4: [1, 6],
            5: [0, 7, 8],
            6: [0, 1, 2],
            7: [0, 5, 8],
            8: [0, 5, 7],
            9: [0, 7]
        };
    }
}

// Initialize the application
let app;

window.addEventListener('DOMContentLoaded', () => {
    app = new ProductSearchApp();
    window.app = app; // Make available globally for debugging
});

// Global helper functions
window.selectProductById = function(productId) {
    if (app) {
        app.selectProductById(productId);
    }
};

// Add global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    
    if (app) {
        app.showNotification('System Error', 
            'An unexpected error occurred. Please refresh the page.', 
            'error');
    }
});