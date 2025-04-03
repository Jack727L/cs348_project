USE soccer_app;

-- Adding a Team to FavoriteTeams
INSERT INTO FavoriteTeams (user_id, team_id)
VALUES (1, 2);

-- Viewing All Favorited Teams for an User
SELECT FT.user_id, T.team_id, T.teamname, FT.dateAdded
FROM FavoriteTeams AS FT
JOIN Teams AS T ON FT.team_id = T.team_id
WHERE FT.user_id = 1
ORDER BY FT.dateAdded DESC;

-- Removing a Teams from FavoriteTeams
DELETE FROM FavoriteTeams
WHERE user_id = 1 AND team_id = 2;


