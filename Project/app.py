from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')
CORS(app)

# Product database
products_db = [
    {"id": 0, "name": "Laptop", "category": "Electronics", "price": 999.99, "rating": 4.5},
    {"id": 1, "name": "Smartphone", "category": "Electronics", "price": 699.99, "rating": 4.7},
    {"id": 2, "name": "Headphones", "category": "Audio", "price": 199.99, "rating": 4.3},
    {"id": 3, "name": "Camera", "category": "Electronics", "price": 599.99, "rating": 4.6},
    {"id": 4, "name": "Smartwatch", "category": "Wearables", "price": 299.99, "rating": 4.4},
    {"id": 5, "name": "Printer", "category": "Office", "price": 149.99, "rating": 4.2},
    {"id": 6, "name": "Tablet", "category": "Electronics", "price": 399.99, "rating": 4.5},
    {"id": 7, "name": "Keyboard", "category": "Accessories", "price": 89.99, "rating": 4.1},
    {"id": 8, "name": "Monitor", "category": "Electronics", "price": 249.99, "rating": 4.4},
    {"id": 9, "name": "Mouse", "category": "Accessories", "price": 49.99, "rating": 4.0}
]

# Product relationship graph
product_graph = {
    0: [1, 2, 8],    # Laptop -> Smartphone, Headphones, Monitor
    1: [3, 4, 6],    # Smartphone -> Camera, Smartwatch, Tablet
    2: [0, 1, 9],    # Headphones -> Laptop, Smartphone, Mouse
    3: [1, 6, 8],    # Camera -> Smartphone, Tablet, Monitor
    4: [1, 6],       # Smartwatch -> Smartphone, Tablet
    5: [0, 7, 8],    # Printer -> Laptop, Keyboard, Monitor
    6: [0, 1, 2],    # Tablet -> Laptop, Smartphone, Headphones
    7: [0, 5, 8],    # Keyboard -> Laptop, Printer, Monitor
    8: [0, 5, 7],    # Monitor -> Laptop, Printer, Keyboard
    9: [0, 7]        # Mouse -> Laptop, Keyboard
}

# KMP Algorithm Implementation
def compute_lps(pattern):
    """Compute Longest Prefix Suffix array for KMP algorithm"""
    lps = [0] * len(pattern)
    length = 0
    i = 1
    
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    return lps

def kmp_search(text, pattern):
    """KMP pattern search algorithm - O(n + m) complexity"""
    if not pattern or not text:
        return []
    
    text = text.lower()
    pattern = pattern.lower()
    
    lps = compute_lps(pattern)
    matches = []
    i = j = 0
    
    while i < len(text):
        if pattern[j] == text[i]:
            i += 1
            j += 1
            
            if j == len(pattern):
                matches.append(i - j)
                j = lps[j - 1]
        elif i < len(text) and pattern[j] != text[i]:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    
    return matches

# Graph Algorithms
def bfs(start_node, graph):
    """Breadth-First Search algorithm"""
    if start_node not in graph:
        return []
    
    visited = set()
    queue = [start_node]
    result = []
    
    visited.add(start_node)
    
    while queue:
        node = queue.pop(0)
        result.append(node)
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result

def dfs(start_node, graph):
    """Depth-First Search algorithm"""
    if start_node not in graph:
        return []
    
    visited = set()
    result = []
    
    def dfs_util(node):
        visited.add(node)
        result.append(node)
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs_util(neighbor)
    
    dfs_util(start_node)
    return result

# API Routes
@app.route('/')
def index():
    """Serve the main HTML page"""
    return render_template('index.html')

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products"""
    return jsonify({
        "success": True,
        "products": products_db,
        "count": len(products_db)
    })

@app.route('/api/graph', methods=['GET'])
def get_graph():
    """Get product relationship graph"""
    return jsonify({
        "success": True,
        "graph": product_graph
    })

@app.route('/api/search', methods=['POST'])
def search_products():
    """Search products using KMP algorithm"""
    data = request.json
    search_text = data.get('text', '')
    pattern = data.get('pattern', '')
    
    if not pattern:
        return jsonify({
            "success": False,
            "error": "Search pattern is required"
        })
    
    # Split products from text
    products = [p.strip() for p in search_text.split(',') if p.strip()]
    
    results = []
    for idx, product in enumerate(products):
        matches = kmp_search(product, pattern)
        if matches:
            results.append({
                "product": product,
                "index": idx,
                "matches": matches,
                "match_count": len(matches)
            })
    
    return jsonify({
        "success": True,
        "pattern": pattern,
        "results": results,
        "total_matches": sum(r['match_count'] for r in results),
        "found_products": len(results)
    })

@app.route('/api/recommend/bfs/<int:product_id>', methods=['GET'])
def get_bfs_recommendations(product_id):
    """Get BFS recommendations for a product"""
    if product_id not in product_graph:
        return jsonify({
            "success": False,
            "error": f"Product ID {product_id} not found"
        })
    
    path = bfs(product_id, product_graph)
    
    return jsonify({
        "success": True,
        "algorithm": "BFS",
        "start_product": product_id,
        "path": path,
        "path_length": len(path),
        "unique_products": len(set(path))
    })

@app.route('/api/recommend/dfs/<int:product_id>', methods=['GET'])
def get_dfs_recommendations(product_id):
    """Get DFS recommendations for a product"""
    if product_id not in product_graph:
        return jsonify({
            "success": False,
            "error": f"Product ID {product_id} not found"
        })
    
    path = dfs(product_id, product_graph)
    
    return jsonify({
        "success": True,
        "algorithm": "DFS",
        "start_product": product_id,
        "path": path,
        "path_length": len(path),
        "unique_products": len(set(path))
    })

@app.route('/api/system/info', methods=['GET'])
def system_info():
    """Get system information"""
    return jsonify({
        "success": True,
        "system": "E-Commerce Product Search System",
        "version": "1.0.0",
        "algorithms": ["KMP Search", "BFS", "DFS"],
        "products_count": len(products_db),
        "graph_nodes": len(product_graph),
        "timestamp": time.time()
    })

@app.route('/api/analyze/text', methods=['POST'])
def analyze_text():
    """Analyze text for patterns"""
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({
            "success": False,
            "error": "Text is required"
        })
    
    # Simple text analysis
    words = text.split()
    word_count = len(words)
    char_count = len(text)
    
    return jsonify({
        "success": True,
        "analysis": {
            "word_count": word_count,
            "character_count": char_count,
            "average_word_length": char_count / word_count if word_count > 0 else 0
        }
    })

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 E-COMMERCE PRODUCT SEARCH SYSTEM")
    print("=" * 60)
    print("📁 Frontend: http://localhost:5000")
    print("🔗 API Documentation:")
    print("   GET  /api/products         - Get all products")
    print("   GET  /api/graph            - Get product graph")
    print("   POST /api/search           - KMP pattern search")
    print("   GET  /api/recommend/bfs/<id> - BFS recommendations")
    print("   GET  /api/recommend/dfs/<id> - DFS recommendations")
    print("   GET  /api/system/info      - System information")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5000, debug=True)