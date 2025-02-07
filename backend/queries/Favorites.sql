------------------- Favorites -------------------
-- Adding a Team to FavoriteTeams
INSERT INTO FavoriteTeams (user_id, team_id)
VALUES (123, 42);
-- Removing a Team from FavoriteTeams
DELETE FROM FavoriteTeams
WHERE user_id = 123 AND team_id = 42;

-- Adding a Player to FavoritePlayers
INSERT INTO FavoritePlayers (user_id, player_id)
VALUES (123, 555);
-- Removing a Player from FavoritePlayers
DELETE FROM FavoritePlayers
WHERE user_id = 123 AND player_id = 555

-- Viewing All Favorited Teams for a User
SELECT FT.dateAdded, T.team_id, T.teamname
FROM FavoriteTeams AS FT
JOIN Teams AS T ON FT.team_id = T.team_id
WHERE FT.user_id = 123
ORDER BY FT.dateAdded DESC;

-- Viewing All Favorited Players for a User
SELECT FP.dateAdded, P.player_id, P.playername
FROM FavoritePlayers AS FP
JOIN Players AS P ON FP.player_id = P.player_id
WHERE FP.user_id = 123
ORDER BY FP.dateAdded DESC;