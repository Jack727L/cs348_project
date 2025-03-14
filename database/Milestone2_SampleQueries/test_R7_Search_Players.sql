USE soccer_app;

-- Search Players by Name, Team, Position, Nationality
SELECT player_id, playername, teamname, position, countryname as nationality, age
FROM Players 
LEFT JOIN Teams 
ON Players.team_id = Teams.team_id
LEFT JOIN Country
ON Players.player_nationality_id = Country.country_id
WHERE 1 = 1
AND LOWER(playername) LIKE '%a%'
AND Players.team_id = 2
AND LOWER(position) LIKE '%gk%'
AND Players.player_nationality_id = 2
ORDER BY playername; 