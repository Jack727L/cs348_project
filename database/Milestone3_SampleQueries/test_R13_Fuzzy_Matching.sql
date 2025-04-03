-- Fuzzy matching
SELECT 
    player_id, 
    playername, 
    team_id
FROM Players
WHERE MATCH(playername) AGAINST('John d' IN NATURAL LANGUAGE MODE);