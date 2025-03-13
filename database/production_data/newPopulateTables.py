import mysql.connector
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
# os.getenv('DB_NAME') os.getenv('DB_USER') os.getenv('DB_PASSWORD')
connection = mysql.connector.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    database='soccer_app',
    user='your_username',
    password='your_password'
)

cursor = connection.cursor()

### Load Roles data
csv_file = './production_data/sample_role.csv'
roles_data = pd.read_csv(csv_file)

for index, row in roles_data.iterrows():
    cursor.execute(
        "INSERT INTO Roles (role_id, rolename) VALUES (%s, %s) "
        "ON DUPLICATE KEY UPDATE rolename = VALUES(rolename)",
        (row['role_id'], row['rolename'])
    )

connection.commit()
print("Roles Data imported successfully!")

### Load Users data
csv_file = './production_data/sample_app_user.csv'
users_data = pd.read_csv(csv_file)

for index, row in users_data.iterrows():
    cursor.execute(
        "INSERT INTO Users (user_id, username, password, email, role_id) "
        "VALUES (%s, %s, %s, %s, %s) "
        "ON DUPLICATE KEY UPDATE "
        "username = VALUES(username), "
        "password = VALUES(password), "
        "email = VALUES(email), "
        "role_id = VALUES(role_id)",
        (
            row['user_id'], row['username'], row['password'], row['email'], row['role_id']
        )
    )
connection.commit()
print("Users Data imported successfully!")

### Load country data
csv_file = './production_data/sample_country.csv'
country_data = pd.read_csv(csv_file)

for index, row in country_data.iterrows():
    cursor.execute(
        "INSERT INTO country (country_id, countryname) VALUES (%s, %s) "
        "ON DUPLICATE KEY UPDATE countryname = VALUES(countryname)",
        (row['country_id'], row['countryname'])
    )
connection.commit()
print("Country Data imported successfully!")

### Load league data
csv_file = './production_data/sample_league.csv'
data = pd.read_csv(csv_file)

for index, row in data.iterrows():
    cursor.execute(
        """
        INSERT INTO Leagues (league_id, leaguename, league_nationality_id)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
            leaguename = VALUES(leaguename),
            league_nationality_id = VALUES(league_nationality_id)
        """,
        (row['league_id'], row['leaguename'], row['league_nationality_id'])
    )
connection.commit()
print("League Data imported successfully!")

### Load team data
csv_file = './production_data/sample_team.csv'
data = pd.read_csv(csv_file)

for index, row in data.iterrows():
    cursor.execute(
        """
        INSERT INTO Teams (team_id, teamname, league_id)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
            teamname = VALUES(teamname),
            league_id = VALUES(league_id)
        """,
        (row['team_id'], row['teamname'], row['league_id'])
    )
connection.commit()
print("Team Data imported successfully!")

#### Load game data
csv_file = './production_data/sample_game.csv'
data = pd.read_csv(csv_file)

for index, row in data.iterrows():
    cursor.execute(
        """
        INSERT INTO Matches (match_id, league_id, hometeam_id, awayteam_id, hometeam_score, awayteam_score, date, match_location)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            league_id = VALUES(league_id),
            hometeam_id = VALUES(hometeam_id),
            awayteam_id = VALUES(awayteam_id),
            hometeam_score = VALUES(hometeam_score),
            awayteam_score = VALUES(awayteam_score),
            date = VALUES(date),
            match_location = VALUES(match_location)
        """,
        (
            row['match_id'], row['league_id'], row['hometeam_id'], row['awayteam_id'], row['hometeam_score'], row['awayteam_score'], row['date'], row['match_location']
        )
        )
connection.commit()
print("Game Data imported successfully!")

### Load player data
csv_file = './production_data/sample_player.csv'
data = pd.read_csv(csv_file)

for index, row in data.iterrows():
    cursor.execute(
        """
        INSERT INTO Players (player_id, playername, team_id, position, player_nationality_id, age)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            playername = VALUES(playername),
            team_id = VALUES(team_id),
            position = VALUES(position),
            player_nationality_id = VALUES(player_nationality_id),
            age = VALUES(age)
        """,
        (
            row['player_id'], row['playername'], row['team_id'], row['position'], row['player_nationality_id'], row['age']
        )
    )
connection.commit()
print("Player Data imported successfully!")

### Load statistics data
csv_file = './production_data/sample_statistics.csv'
data = pd.read_csv(csv_file)

for index, row in data.iterrows():
    cursor.execute(
        """
        INSERT INTO Statistics (match_id, player_id, goal, pass_acc, assist, playtime)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (row['match_id'], row['player_id'], row['goal'], row['pass_acc'], row['assist'], row['playtime'])
    )
connection.commit()
print("Statistics Data imported successfully!")

### Load favorite players data
csv_file = './production_data/sample_favoriteplayers.csv'
data = pd.read_csv(csv_file)

for index, row in data.iterrows():
    cursor.execute(
        """
        INSERT INTO FavoritePlayers (user_id, player_id, dateAdded)
        VALUES (%s, %s, %s)
        """,
        (row['user_id'], row['player_id'], row['dateAdded'])
    )
connection.commit()
print("FavoritePlayers Data imported successfully!")

### Load favorite teams data
csv_file = './production_data/sample_favoriteteams.csv'
data = pd.read_csv(csv_file)

for index, row in data.iterrows():
    cursor.execute(
        """
        INSERT INTO FavoriteTeams (user_id, team_id, dateAdded)
        VALUES (%s, %s, %s)
        """,
        (row['user_id'], row['team_id'], row['dateAdded'])
    )
connection.commit()
print("FavoriteTeams Data imported successfully!")

# Close the connection
cursor.close()
connection.close()