import sqlite3

conn = sqlite3.connect('leaderboards.db')
conn.close()

from   flask import Flask, jsonify, render_template, request
from   flask_sqlalchemy import SQLAlchemy
import datetime
import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///leaderboards.db'  # Corrected the database URI

db = SQLAlchemy(app)

class Leaderboard(db.Model):
    id             = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name           = db.Column(db.String(255), nullable=False)
    scores         = db.relationship('PlayerScore', backref='leaderboard', lazy=True)

    def __init__(self, name):
        self.name  = name

class Player(db.Model):
    id             = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name           = db.Column(db.String(255), nullable=False)
    scores         = db.relationship('PlayerScore', backref='player', lazy=True)

    def __init__(self, name):
        self.name  = name

class PlayerScore(db.Model):
    id             = db.Column(db.Integer, primary_key=True, autoincrement=True)
    player_id      = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    leaderboard_id = db.Column(db.Integer, db.ForeignKey('leaderboard.id'), nullable=False)
    score          = db.Column(db.Integer, nullable=False)
    date_achieved  = db.Column(db.Date, nullable=False)

THEMER_DEFAULT_DIRECTORY = "static/css/themes"

def update_player(board, player, func):
    target = PlayerScore.query.filter_by(player_id=player, leaderboard_id=board).first()

    if target:
        target.score         = func(target.score)
        target.date_achieved = datetime.date.today()

        db.session.commit()

        return True

    return False

def create_player(board, name, initpoints):
    exists = Player.query.join(PlayerScore).filter(Player.name == name, PlayerScore.leaderboard_id == board).first()

    if exists:
        return False

    player = Player(name=name)

    db.session.add(player)
    db.session.commit()

    player_score                = PlayerScore()
    player_score.leaderboard_id = board
    player_score.score          = initpoints
    player_score.date_achieved  = datetime.date.today()

    player.scores.append(player_score)

    db.session.commit()

    return True

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/board/<id>")
def board(id):
    # test
    create_player(id, "big jimmy" + str(random.randint(0, 1000)), 1000)

    leaderboard = Leaderboard.query.get(id)
    leaderboard_data = {}

    if leaderboard:
        leaderboard_data = {
            'id':     leaderboard.id,
            'name':   leaderboard.name,
            'scores': [{'player_name': score.player.name, 'score': score.score, 'date_achieved': score.date_achieved}
                       for score in leaderboard.scores]
        }

    return render_template('leaderboard.html', data=leaderboard_data)

@app.route('/board/create', methods=['POST'])
def create_board():
    # duplicate board names should be allowed
    board_name = request.form.get('boardName')

    board = Leaderboard(name=board_name)

    db.session.add(board)
    db.session.commit()

    return jsonify({'message': 'success'})

@app.context_processor
def inject_global_variables():
    name = "terminal"
    return dict(name=name)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
