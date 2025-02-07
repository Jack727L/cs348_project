USE soccer_app;

-- Search Games by Dates (by Leagues)
SELECT Matches.match_id, Matches.date, Matches.match_location,
       Matches.league_id, Leagues.leaguename, 
       Matches.hometeam_id, Matches.awayteam_id,
       home.teamname as home_team, away.teamname as away_team, 
       Matches.hometeam_score, Matches.awayteam_score
FROM Matches 
LEFT JOIN Leagues ON Matches.league_id = Leagues.league_id
LEFT JOIN Teams as home on Matches.hometeam_id = home.team_id
LEFT JOIN Teams as away on Matches.awayteam_id = away.team_id
WHERE Matches.date BETWEEN '2025-01-15' AND '2025-01-17'
AND Matches.league_id = 1 -- optional 
ORDER BY Matches.date; 
