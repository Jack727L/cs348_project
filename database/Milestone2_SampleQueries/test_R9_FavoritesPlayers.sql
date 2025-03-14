USE soccer_app;

-- Adding a Players to FavoritePlayers
INSERT INTO FavoritePlayers (user_id, player_id)
VALUES (1, 5);

-- Viewing All Favorited Teams for an User
SELECT f.user_id, f.player_id, p.playername, t.teamname, p.position, f.dateAdded 
FROM FavoritePlayers f
LEFT JOIN Players p 
ON f.player_id = p.player_id
LEFT JOIN Teams t
ON p.team_id = t.team_id
WHERE user_id = 1 
ORDER BY dateAdded DESC;

-- Removing a Teams from FavoriteTeams
DELETE FROM FavoritePlayers
WHERE user_id = 1 AND player_id = 5;


