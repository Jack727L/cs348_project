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
async def signup(username: str = Form(...), password: str = Form(...), email: str = Form(...)):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Users WHERE username = %s", (username,))
    user_exist = cursor.fetchone() is not None

    if user_exist:
        raise HTTPException(status_code=401, detail="Username already exists.")

    cursor.execute("INSERT INTO Users(username, password, email, role_id)  \
                   VALUES (%s, %s, %s, 2);", (username, password, email))
    db.commit()

    cursor.close()
    db.close()
    return JSONResponse(content={"message": "User registered successfully. Please log in."}, status_code=201)

##### Log In endpoint
@app.post("/login")
async def login(username: str = Form(...), password: str = Form(...)):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Users WHERE username = %s AND password = %s", (username, password))
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

    query = ("""SELECT Matches.match_id, Matches.date, Matches.match_location,
                       Matches.league_id, Leagues.leaguename, 
                       Matches.hometeam_id, Matches.awayteam_id,
                       home.teamname as home_team, away.teamname as away_team, 
                       Matches.hometeam_score, Matches.awayteam_score
                FROM Matches 
                LEFT JOIN Leagues ON Matches.league_id = Leagues.league_id
                LEFT JOIN Teams as home on Matches.hometeam_id = home.team_id 
                LEFT JOIN Teams as away on Matches.awayteam_id = away.team_id """)
    if league and league != 'all':
        query += "WHERE Leagues.league_id = %s"
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
    cursor.execute("SELECT * FROM Leagues;")
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

    query = ("SELECT * FROM Players ")
    if team and team != 'all':
        query += "WHERE team_id = %s"
        cursor.execute(query, (team,))
    else:
        cursor.execute(query)

    players = cursor.fetchall()
    cursor.close()
    db.close()
    return players

##### Number of match win/lose/draw by team
##TBD check queries Team_Stats.sql
@app.get("/teams/stats")
async def get_teams_stat(team: str = None):
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    query = ("""WITH match_status as (
            SELECT Matches.match_id, 
                    CASE WHEN (hometeam_score = awayteam_score) THEN 1 
                        ELSE 0 END AS draw, 
                    CASE WHEN (hometeam_score > awayteam_score) THEN hometeam_id \
                        WHEN (hometeam_score < awayteam_score) THEN awayteam_id \
                        ELSE hometeam_id END AS win_team, \
                    CASE WHEN (hometeam_score > awayteam_score) THEN awayteam_id \
                        WHEN (hometeam_score < awayteam_score) THEN hometeam_id \
                        ELSE awayteam_id END AS lose_team \
            FROM Matches
            ), 

            team_win as (
            SELECT Teams.team_id, count(match_status.match_id) as win
            FROM Teams
            LEFT JOIN match_status on Teams.team_id = match_status.win_team and match_status.draw = 0
            GROUP BY Teams.team_id
            ),

            team_lose as (
            SELECT Teams.team_id, count(match_status.match_id) as lose
            FROM Teams
            LEFT JOIN match_status on Teams.team_id = match_status.lose_team and match_status.draw = 0
            GROUP BY Teams.team_id
            ), 

            team_draw as (
            SELECT Teams.team_id, count(a.match_id) + count(b.match_id)  as draw
            FROM Teams
            LEFT JOIN match_status as a on Teams.team_id = a.win_team and a.draw = 1
            LEFT JOIN match_status as b on Teams.team_id = b.lose_team and b.draw = 1
            GROUP BY Teams.team_id
            )

            SELECT Teams.team_id, Teams.teamname, Teams.league_id, team_win.win, team_lose.lose, team_draw.draw
            FROM Teams
            LEFT JOIN team_win on Teams.team_id = team_win.team_id
            LEFT JOIN team_lose on Teams.team_id = team_lose.team_id
            LEFT JOIN team_draw on Teams.team_id = team_draw.team_id
            """)
    cursor.execute(query)
    leagues = cursor.fetchall()
    cursor.close()
    db.close()
    return leagues

@app.get("/teams/details")
async def get_team_details(team: str = None):
    if not team:
        raise HTTPException(status_code=400, detail="Team ID must be provided.")

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    # Fetch team statistics with league name
    stats_query = ("""WITH match_status as (
            SELECT Matches.match_id, 
                   CASE WHEN (hometeam_score = awayteam_score) THEN 1 
                        ELSE 0 END AS draw, 
                   CASE WHEN (hometeam_score > awayteam_score) THEN hometeam_id 
                        WHEN (hometeam_score < awayteam_score) THEN awayteam_id 
                        ELSE hometeam_id END AS win_team, 
                   CASE WHEN (hometeam_score > awayteam_score) THEN awayteam_id 
                        WHEN (hometeam_score < awayteam_score) THEN hometeam_id 
                        ELSE awayteam_id END AS lose_team 
            FROM Matches
            ), 

            team_win as (
            SELECT Teams.team_id, count(match_status.match_id) as win
            FROM Teams
            LEFT JOIN match_status on Teams.team_id = match_status.win_team and match_status.draw = 0
            WHERE Teams.team_id = %s
            GROUP BY Teams.team_id
            ),

            team_lose as (
            SELECT Teams.team_id, count(match_status.match_id) as lose
            FROM Teams
            LEFT JOIN match_status on Teams.team_id = match_status.lose_team and match_status.draw = 0
            WHERE Teams.team_id = %s
            GROUP BY Teams.team_id
            ), 

            team_draw as (
            SELECT Teams.team_id, count(a.match_id) + count(b.match_id) as draw
            FROM Teams
            LEFT JOIN match_status as a on Teams.team_id = a.win_team and a.draw = 1
            LEFT JOIN match_status as b on Teams.team_id = b.lose_team and b.draw = 1
            WHERE Teams.team_id = %s
            GROUP BY Teams.team_id
            )

            SELECT Teams.team_id, Teams.teamname, Leagues.leaguename, 
                   IFNULL(team_win.win, 0) as win, 
                   IFNULL(team_lose.lose, 0) as lose, 
                   IFNULL(team_draw.draw, 0) as draw
            FROM Teams
            LEFT JOIN team_win on Teams.team_id = team_win.team_id
            LEFT JOIN team_lose on Teams.team_id = team_lose.team_id
            LEFT JOIN team_draw on Teams.team_id = team_draw.team_id
            LEFT JOIN Leagues on Teams.league_id = Leagues.league_id
            WHERE Teams.team_id = %s
            """)
    cursor.execute(stats_query, (team, team, team, team))
    stats = cursor.fetchone()

    # Fetch team players
    players_query = "SELECT * FROM Players WHERE team_id = %s"
    cursor.execute(players_query, (team,))
    players = cursor.fetchall()

    cursor.close()
    db.close()

    if not stats:
        raise HTTPException(status_code=404, detail="Team not found.")

    return {
        "team_id": stats["team_id"],
        "teamname": stats["teamname"],
        "league_name": stats["leaguename"],
        "statistics": {
            "win": stats["win"],
            "lose": stats["lose"],
            "draw": stats["draw"]
        },
        "players": players
    }

if __name__ == '__main__':
    uvicorn.run(app, port=5001)
