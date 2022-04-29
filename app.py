# save this as app.py
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!"

@app.route("/ping")
def ping():
    return "pong"

@app.route("/error")
def error():
    return 1/0

if __name__ == '__main__':
    app.run(debug=True)