from flask import Flask, render_template

THEMER_DEFAULT_DIRECTORY = "static/css/themes"

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/board/<id>")
def board(id):
    # query database for id
    # request authentification if required
    return render_template('leaderboard.html')

@app.context_processor
def inject_global_variables():
    name = "terminal"
    return dict(name=name)

if __name__ == "__main__":
    app.run(debug=True)
