-- Event: Scheduled daily job to notify users when a favorite player reaches a goal milestone
CREATE EVENT daily_player_milestone_event
ON SCHEDULE EVERY 1 MINUTE -- This event runs once every day
STARTS CURRENT_TIMESTAMP -- The event starts running immediately from the current date/time
DO
-- Insert notifications only for new goal milestones and avoid duplicates
INSERT INTO Notifications (user_id, message)
SELECT DISTINCT fp.user_id, 
       CONCAT('🏅 ', p.playername, ' reached ', total_goals, ' goals this season!')
FROM FavoritePlayers fp
-- Join Players table to get the player's name
JOIN Players p ON fp.player_id = p.player_id
-- Subquery: Get players who have hit 10, 20, or 30 total goals
JOIN (
    SELECT player_id, SUM(goal) AS total_goals
    FROM Statistics
    GROUP BY player_id
    HAVING total_goals IN (10, 20, 30) -- Only notify for these milestone numbers
) AS player_totals ON player_totals.player_id = p.player_id
-- Prevent duplicate notifications by checking existing messages
LEFT JOIN Notifications n ON n.user_id = fp.user_id 
    AND n.message LIKE CONCAT('%', p.playername, ' reached ', player_totals.total_goals, '%')
WHERE n.notification_id IS NULL; -- Only insert if this exact message hasn't already been sent


-- Create a scheduled event named 'cleanup_old_notifications' (Run every 1 minute)
CREATE EVENT cleanup_old_notifications
ON SCHEDULE EVERY 1 MINUTE
DO
DELETE FROM Notifications -- Delete notifications older than 1 minute
WHERE created_at < NOW() - INTERVAL 1 MINUTE; 