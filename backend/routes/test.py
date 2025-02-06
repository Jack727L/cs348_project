from flask import Flask, render_template, request, jsonify
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

db = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
)

cursor = db.cursor(dictionary=True)

##### Sign In
# username = 'test2'
# password = 'password2'
# cursor.execute("SELECT * FROM app_user WHERE username = %s AND password = %s;", (username, password))
# account = cursor.fetchone()
# if account:
#     print(account['id'])
# else:
#     print("Incorrect username or password.")

##### Sign Up
# username = 'test3'
# password = 'password3'
# cursor.execute("SELECT * FROM app_user WHERE username = %s", (username, ))
# user_exist = cursor.fetchone() is not None

# if user_exist:
#     print("Username already exists.")
# else:
#     cursor.execute("INSERT INTO app_user(username, password, role) VALUES (%s, %s, 'user');", (username, password))
#     db.commit()
#     print("User registered successfully.")


##### Recent games
league = 'Bundesliga'

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
print(games)

cursor.close()
db.close()