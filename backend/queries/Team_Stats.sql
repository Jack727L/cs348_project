USE soccer_app;

-- Players infomation by Team
SELECT * FROM Players
WHERE team_id = 1;

-- Number of win/lose/draw per team
WITH match_status as (
SELECT Matches.match_id, 
    CASE WHEN (hometeam_score = awayteam_score) THEN 1 
        ELSE 0 END AS draw, 
    CASE WHEN (hometeam_score > awayteam_score) THEN hometeam_id \
        WHEN (hometeam_score < awayteam_score) THEN awayteam_id \
        ELSE hometeam_id END AS win_team, \
    CASE WHEN (hometeam_score > awayteam_score) THEN awayteam_id \
        WHEN (hometeam_score < awayteam_score) THEN hometeam_id \
        ELSE awayteam_id END AS lose_team \
FROM Matches
), 

team_win as (
SELECT Teams.team_id, count(match_status.match_id) as win
FROM Teams
LEFT JOIN match_status on Teams.team_id = match_status.win_team and match_status.draw = 0
GROUP BY Teams.team_id
),

team_lose as (
SELECT Teams.team_id, count(match_status.match_id) as lose
FROM Teams
LEFT JOIN match_status on Teams.team_id = match_status.lose_team and match_status.draw = 0
GROUP BY Teams.team_id
), 

team_draw as (
SELECT Teams.team_id, count(a.match_id) + count(b.match_id)  as draw
FROM Teams
LEFT JOIN match_status as a on Teams.team_id = a.win_team and a.draw = 1
LEFT JOIN match_status as b on Teams.team_id = b.lose_team and b.draw = 1
GROUP BY Teams.team_id
)

SELECT Teams.team_id, Teams.teamname, Teams.league_id, team_win.win, team_lose.lose, team_draw.draw
FROM Teams
LEFT JOIN team_win on Teams.team_id = team_win.team_id
LEFT JOIN team_lose on Teams.team_id = team_lose.team_id
LEFT JOIN team_draw on Teams.team_id = team_draw.team_id


