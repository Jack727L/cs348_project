---- Players infomation by Team
SELECT * FROM PLAYER
WHERE team.id = 1

---- Number of win/lose/draw per team
WITH match_status as (
SELECT GAME.id, 
    CASE WHEN (home_team_score = away_team_score) THEN 1 
        ELSE 0 END AS draw, 
    CASE WHEN (home_team_score > away_team_score) THEN home_team_id \
        WHEN (home_team_score < away_team_score) THEN away_team_id \
        ELSE home_team_id END AS win_team, \
    CASE WHEN (home_team_score > away_team_score) THEN away_team_id \
        WHEN (home_team_score < away_team_score) THEN home_team_id \
        ELSE away_team_id END AS lose_team \
FROM GAME
), 

team_win as (
SELECT TEAM.id, count(match_status.id) as win
FROM TEAM
LEFT JOIN match_status on team.id = match_status.win_team and match_status.draw = 0
GROUP BY TEAM.id
),

team_lose as (
SELECT TEAM.id, count(match_status.id) as lose
FROM TEAM
LEFT JOIN match_status on team.id = match_status.lose_team and match_status.draw = 0
GROUP BY TEAM.id
), 

team_draw as (
SELECT TEAM.id, count(a.id) + count(b.id)  as draw
FROM TEAM
LEFT JOIN match_status as a on team.id = a.win_team and a.draw = 1
LEFT JOIN match_status as b on team.id = b.lose_team and b.draw = 1
GROUP BY TEAM.id
)

SELECT TEAM.id, TEAM.name, TEAM.league_id, team_win.win, team_lose.lose, team_draw.draw
FROM TEAM
LEFT JOIN team_win on team.id = team_win.id
LEFT JOIN team_lose on team.id = team_lose.id
LEFT JOIN team_draw on team.id = team_draw.id


