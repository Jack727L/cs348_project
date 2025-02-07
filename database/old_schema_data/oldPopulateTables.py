import mysql.connector
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
connection = mysql.connector.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    database=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD')
)

cursor = connection.cursor()

### Load app_user data
csv_file = 'database/sample_app_user.csv' 
data = pd.read_csv(csv_file)

for index, row in data.iterrows():
    cursor.execute(
        "INSERT INTO app_user (username, password, role) VALUES (%s, %s, %s)",
        (row['username'], row['password'], row['role'])
    )

connection.commit()
print("App_User Data imported successfully!")

### Load country data
csv_file = 'database/sample_country.csv' 
data = pd.read_csv(csv_file)

for index, row in data.iterrows():
    cursor.execute(
        "INSERT INTO country (id,name) VALUES (%s, %s)",
        (row['id'], row['name'])
    )

connection.commit()
print("Country Data imported successfully!")

### Load league data
csv_file = 'database/sample_league.csv' 
data = pd.read_csv(csv_file)

for index, row in data.iterrows():
    cursor.execute(
        "INSERT INTO league (id,name,country_id,level) VALUES (%s, %s, %s, %s)",
        (row['id'], row['name'], row['country_id'], row['level'])
    )
connection.commit()
print("League Data imported successfully!")

### Load team data
csv_file = 'database/sample_team.csv' 
data = pd.read_csv(csv_file)

for index, row in data.iterrows():
    cursor.execute(
        "INSERT INTO team (id,name,league_id) VALUES (%s, %s, %s)",
        (row['id'], row['name'], row['league_id'])
    )
connection.commit()
print("Team Data imported successfully!")

#### Load game data
csv_file = 'database/sample_game.csv' 
data = pd.read_csv(csv_file)

for index, row in data.iterrows():
    cursor.execute(
        "INSERT INTO game (id,league_id,home_team_id,away_team_id,home_team_score,away_team_score,date) \
            VALUES (%s, %s, %s, %s, %s, %s, %s)",
        (row['id'], row['league_id'], row['home_team_id'], row['away_team_id'], row['home_team_score'], row['away_team_score'], row['date'])
    )
connection.commit()
print("Game Data imported successfully!")

# Close the connection
cursor.close()
connection.close()