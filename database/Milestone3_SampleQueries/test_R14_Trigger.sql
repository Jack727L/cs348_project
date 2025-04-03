-- Trigger: Automatically notifies users when a new match is inserted
CREATE TRIGGER notify_match_insert
AFTER INSERT ON Matches -- This trigger runs after a new row is inserted into the Matches table
FOR EACH ROW -- The trigger runs once per inserted row
BEGIN
    -- Notify users who have marked the home team as a favorite
    INSERT INTO Notifications(user_id, message)
    SELECT user_id, CONCAT('🔔 ', home.teamname, ' has an upcoming match on ', NEW.date)
    FROM FavoriteTeams ft 
    JOIN Teams home ON ft.team_id = home.team_id
    WHERE home.team_id = NEW.hometeam_id;

    -- Notify users who have marked the away team as a favorite
    INSERT INTO Notifications(user_id, message)
    SELECT user_id, CONCAT('🔔 ', away.teamname, ' has an upcoming match on ', NEW.date)
    FROM FavoriteTeams ft 
    JOIN Teams away ON ft.team_id = away.team_id
    WHERE away.team_id = NEW.awayteam_id;
END;