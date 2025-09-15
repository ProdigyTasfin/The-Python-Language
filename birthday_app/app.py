from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def birthday():
    name = ""
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
    
    return render_template('index.html', name=name)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)