USE soccer_app;

SELECT 
    player_id,
    playername,
    teamname,
    leaguename,
    nationality,
    total_goals,
    RANK() OVER (ORDER BY total_goals DESC) AS score_rank
FROM (
    SELECT 
        p.player_id,
        p.playername, 
        t.teamname, 
        l.leaguename, 
        c.countryname AS nationality, 
        SUM(s.goal) AS total_goals
    FROM Statistics s
    INNER JOIN Players p ON s.player_id = p.player_id
    INNER JOIN Teams t ON p.team_id = t.team_id
    INNER JOIN Leagues l ON t.league_id = l.league_id
    LEFT JOIN Country c ON l.league_nationality_id = c.country_id
    GROUP BY p.player_id, p.playername, t.teamname, l.leaguename, c.countryname
) AS GoalsSubquery
ORDER BY score_rank ASC, playername ASC
LIMIT 10;