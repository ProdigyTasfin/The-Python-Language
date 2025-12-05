from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory data storage
products = [
    {"id": 0, "name": "Laptop"},
    {"id": 1, "name": "Smartphone"},
    {"id": 2, "name": "Headphones"},
    {"id": 3, "name": "Camera"},
    {"id": 4, "name": "Smartwatch"},
    {"id": 5, "name": "Printer"}
]

graph = {
    0: [1, 2],
    1: [3, 4],
    2: [5],
    3: [],
    4: [],
    5: []
}

@app.route('/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/graph', methods=['GET'])
def get_graph():
    return jsonify(graph)

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    text = data.get('text', '')
    pattern = data.get('pattern', '')
    
    # Simple KMP implementation
    def kmp_search(t, p):
        if not p:
            return []
        n, m = len(t), len(p)
        lps = [0] * m
        j = 0
        for i in range(1, m):
            while j > 0 and p[i] != p[j]:
                j = lps[j-1]
            if p[i] == p[j]:
                j += 1
                lps[i] = j
        j = 0
        matches = []
        for i in range(n):
            while j > 0 and t[i] != p[j]:
                j = lps[j-1]
            if t[i] == p[j]:
                j += 1
            if j == m:
                matches.append(i - j + 1)
                j = lps[j-1]
        return matches
    
    matches = kmp_search(text, pattern)
    return jsonify({
        "matches": matches,
        "count": len(matches)
    })

@app.route('/bfs/<int:start>', methods=['GET'])
def bfs(start):
    visited = set()
    queue = [start]
    result = []
    
    visited.add(start)
    
    while queue:
        node = queue.pop(0)
        result.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return jsonify({"path": result})

@app.route('/dfs/<int:start>', methods=['GET'])
def dfs(start):
    visited = set()
    result = []
    
    def dfs_util(node):
        visited.add(node)
        result.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs_util(neighbor)
    
    dfs_util(start)
    return jsonify({"path": result})

if __name__ == '__main__':
    app.run(debug=True, port=5000)