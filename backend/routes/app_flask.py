from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# @app.route('/')
# def index():
#     connection = get_db_connection()
#     if connection:
#         cursor = connection.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM student;")
#         rows = cursor.fetchall()
#         cursor.close()
#         connection.close()
#         return render_template('index.html', students=rows)
#     else:
#         return "Failed to connect to the database."

@app.route('/')
def home():
    connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
    )
    if connection.is_connected():
        return "Welcome to CS348~~ Connected to Database."
    else:
        return "Welcome to CS348~~"
    
# Route for sign up
@app.route('/signup', methods=['POST'])
def signup():
    username = request.form['username']
    password = request.form['password']

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM app_user WHERE username = %s", (username, ))
    user_exist = cursor.fetchone() is not None

    if user_exist:
        return jsonify({"error": "Username already exists."}), 401
    
    cursor.execute("INSERT INTO app_user(username, password, role) VALUES (%s, %s, 'user'); ", (username, password))
    db.commit()

    cursor.close()
    db.close()
        
    return jsonify({"message": "User registered successfully. Please log in."}), 201

# Route for login
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM app_user WHERE username = %s AND password = %s", (username, password))
    account = cursor.fetchone()

    cursor.close()
    db.close()

    if account:
        return jsonify({"message": "Login successful!", "id": account['id']}), 200
    else:
        return jsonify({"error": "Incorrect username or password."}), 400

# Route for logout    
@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logout successful."}), 200

# Route for recent games
@app.route('/recentgames',  methods=['GET'])
def recentGames():
    league = request.args.get('league')

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    # Might need to modify query for actual dataset to return most recent 30/50 games

    if (league == 'all'): 
        cursor.execute("SELECT LEAGUE.name as league_name, \
                    home.name as home_team,\
                    away.name as away_team, \
                    game.home_team_score, game.away_team_score,  \
                    game.date \
                    FROM GAME \
                    LEFT JOIN LEAGUE ON GAME.league_id = LEAGUE.id \
                    LEFT JOIN TEAM as home on GAME.home_team_id = home.id \
                    LEFT JOIN TEAM as away on GAME.away_team_id = away.id ")
    else: 
        cursor.execute("SELECT LEAGUE.name as league_name, \
                    home.name as home_team,\
                    away.name as away_team, \
                    game.home_team_score, game.away_team_score,  \
                    game.date \
                    FROM GAME \
                    LEFT JOIN LEAGUE ON GAME.league_id = LEAGUE.id \
                    LEFT JOIN TEAM as home on GAME.home_team_id = home.id \
                    LEFT JOIN TEAM as away on GAME.away_team_id = away.id \
                    WHERE LEAGUE.name = %s", (league, ))
    
    games = cursor.fetchall()

    cursor.close()
    db.close()
    return jsonify(games)

@app.route('/leagues', methods=['GET'])
def get_all_leagues():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM LEAGUE;")
    leagues = cursor.fetchall()
    cursor.close()
    db.close()
    return jsonify(leagues)

if __name__ == '__main__':
    app.run(debug=True, port=5001)