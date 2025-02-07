from fastapi import FastAPI, HTTPException, Form, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.get("/")
async def home():
    connection = get_db_connection()
    if connection and connection.is_connected():
        return {"message": "Welcome to CS348~~ Connected to Database."}
    else:
        return {"message": "Welcome to CS348~~"}

##### Sign Up endpoint
@app.post("/signup")
async def signup(username: str = Form(...), password: str = Form(...)):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM app_user WHERE username = %s", (username,))
    user_exist = cursor.fetchone() is not None

    if user_exist:
        raise HTTPException(status_code=401, detail="Username already exists.")

    cursor.execute("INSERT INTO app_user(username, password, role) VALUES (%s, %s, 'user');", (username, password))
    db.commit()

    cursor.close()
    db.close()
    return JSONResponse(content={"message": "User registered successfully. Please log in."}, status_code=201)

##### Log In endpoint
@app.post("/login")
async def login(username: str = Form(...), password: str = Form(...)):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM app_user WHERE username = %s AND password = %s", (username, password))
    account = cursor.fetchone()
    cursor.close()
    db.close()

    if account:
        return {"message": "Login successful!", "id": account['id']}
    else:
        raise HTTPException(status_code=400, detail="Incorrect username or password.")


@app.post("/logout")
async def logout():
    return {"message": "Logout successful."}

##### Recent Games by league_id endpoints
@app.get("/recentgames")
async def recent_games(league: str = None):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    query = ("SELECT GAME.league_id, LEAGUE.name as league_name, "
             "GAME.home_team_id as home_team_id, GAME.away_team_id as away_team_id, "
             "home.name as home_team, away.name as away_team, "
             "game.home_team_score, game.away_team_score, game.date FROM GAME "
             "LEFT JOIN LEAGUE ON GAME.league_id = LEAGUE.id "
             "LEFT JOIN TEAM as home on GAME.home_team_id = home.id "
             "LEFT JOIN TEAM as away on GAME.away_team_id = away.id ")
    if league and league != 'all':
        query += "WHERE LEAGUE.id = %s"
        cursor.execute(query, (league,))
    else:
        cursor.execute(query)

    games = cursor.fetchall()
    cursor.close()
    db.close()
    return games

##### Leagues info 
@app.get("/leagues")
async def get_all_leagues():
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM LEAGUE;")
    leagues = cursor.fetchall()
    cursor.close()
    db.close()
    return leagues

############ TEAM Statistics ###############
##### Players by team_id
@app.get("/teams/players")
async def get_team_player(team: str = None):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    query = ("SELECT * FROM PLAYER")
    if team and team != 'all':
        query += "WHERE team.id = %s"
        cursor.execute(query, (team,))
    else:
        cursor.execute(query)

    players = cursor.fetchall()
    cursor.close()
    db.close()
    return players

##### Number of match win/lose/draw by team
# TBD check queries win_by_team.sql
# @app.get("/teams/stats")
# async def get_teams_stat(team: str = None):
#     db = get_db_connection()
#     cursor = db.cursor(dictionary=True)
#     cursor.execute()
#     leagues = cursor.fetchall()
#     cursor.close()
#     db.close()
#     return leagues

if __name__ == '__main__':
    uvicorn.run(app, port=5001)
