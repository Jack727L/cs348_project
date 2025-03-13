import pandas as pd
import random
from datetime import datetime, timedelta

# Load team data
teams = pd.read_csv('sample_team.csv')

matches = []
match_id = 1
base_date = datetime.now()

# Iterate through each league
for league_id in teams['league_id'].unique():
    league_teams = teams[teams['league_id'] == league_id]

    # Generate all unique matches within the league (excluding self-match)
    for i, home_team in league_teams.iterrows():
        for j, away_team in league_teams.iterrows():
            if home_team['team_id'] != away_team['team_id']:
                match = {
                    'match_id': match_id,
                    'league_id': league_id,
                    'hometeam_id': home_team['team_id'],
                    'awayteam_id': away_team['team_id'],
                    'hometeam_score': random.randint(0, 5),
                    'awayteam_score': random.randint(0, 5),
                    'date': (base_date + timedelta(days=match_id)).strftime('%Y/%m/%d'),
                    'match_location': home_team['teamname'] + " Stadium"
                }
                matches.append(match)
                match_id += 1

# Create DataFrame and export to CSV
matches_df = pd.DataFrame(matches)
matches_df.to_csv('sample_game.csv', index=False)

print('sample_game.csv generated successfully.')