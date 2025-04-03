SELECT 
    s.player_id, 
    p.playername, 
    m.date,
    s.goal,
    AVG(s.goal) OVER (PARTITION BY s.player_id ORDER BY m.date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS rolling_goal_avg
FROM Statistics s
JOIN Matches m ON s.match_id = m.match_id
JOIN Players p ON s.player_id = p.player_id
ORDER BY s.player_id, m.date;
