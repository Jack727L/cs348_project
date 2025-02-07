---- Return recent games by league or all leagues
SELECT GAME.league_id, LEAGUE.name as league_name, 
       GAME.home_team_id as home_team_id, GAME.away_team_id as away_team_id,
       home.name as home_team, away.name as away_team, 
       game.home_team_score, game.away_team_score, game.date FROM GAME 
       LEFT JOIN LEAGUE ON GAME.league_id = LEAGUE.id 
       LEFT JOIN TEAM as home on GAME.home_team_id = home.id 
       LEFT JOIN TEAM as away on GAME.away_team_id = away.id 
WHERE LEAGUE.id = 1 --- optional
