import sqlite3
from   flask import Flask, jsonify, render_template, request
from   flask_sqlalchemy import SQLAlchemy
from   flask_migrate import Migrate
import datetime
import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///leaderboards.db'

db      = SQLAlchemy(app)
migrate = Migrate(app, db)

class Leaderboard(db.Model):
    id            = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name          = db.Column(db.String(255), nullable=False)
    scores        = db.relationship('PlayerScore', backref='leaderboard', lazy=True)

    def __init__(self, name):
        self.name = name

class PlayerScore(db.Model):
    id             = db.Column(db.Integer, primary_key=True, autoincrement=True)
    player_name    = db.Column(db.String(255), nullable=False)
    quote          = db.Column(db.String(40), default="I'm kinda bad at this game", nullable=True)
    leaderboard_id = db.Column(db.Integer, db.ForeignKey('leaderboard.id'), nullable=False)
    score          = db.Column(db.Integer, nullable=False)
    date_achieved  = db.Column(db.Date, nullable=False)

    def __init__(self, player_name, leaderboard_id, score, quote=None):
        self.player_name    = player_name
        self.leaderboard_id = leaderboard_id
        self.score          = score
        self.date_achieved  = datetime.date.today()
        self.quote          = quote

def update_player(board, player_name, func):
    target = PlayerScore.query.filter_by(player_name=player_name, leaderboard_id=board).first()

    if target:
        target.score         = func(target.score)
        target.date_achieved = datetime.date.today()

        db.session.commit()
        return True

    return False

def create_player(board, player_name, initpoints, quote=None):
    exists = PlayerScore.query.filter_by(player_name=player_name, leaderboard_id=board).first()

    if exists:
        return False

    player_score = PlayerScore(player_name=player_name, leaderboard_id=board, score=initpoints, quote=quote)

    db.session.add(player_score)
    db.session.commit()

    return True

def update_player_rankings(leaderboard):
    if leaderboard:
        players = PlayerScore.query.filter_by(leaderboard_id=leaderboard.id).all()
        players = sorted(players, key=lambda player: player.score, reverse=True)

        for position, player in enumerate(players, start=1):
            print(position)
            player.position = position

        db.session.commit()

        return True

    return False

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/board/<id>")
def board(id):
    leaderboard = Leaderboard.query.get(id)
    leaderboard_data = {}

    update_player_rankings(leaderboard)

    if leaderboard:
        leaderboard_data = {
                'id': leaderboard.id,
                'name': leaderboard.name,
                'scores': [{'player_name': score.player_name, 'score': score.score, 'date_achieved': score.date_achieved}
                           for score in leaderboard.scores]
                }

    return render_template('leaderboard.html', data=leaderboard_data)

@app.route('/board/create', methods=['POST'])
def create_board():
    board_name = request.form.get('boardName')

    board = Leaderboard(name=board_name)

    db.session.add(board)
    db.session.commit()

    return jsonify({'message': 'success'})

@app.context_processor
def inject_global_variables():
    name = "terminal"
    return dict(name=name)

migrate = Migrate(app, db)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

