-- Index creation for performance improvement
CREATE INDEX idx_players_team_id ON Players(team_id);


-- Define a procedure called TransferPlayer to safely transfer a player
CREATE PROCEDURE TransferPlayer(
    IN player INT,      -- Player's ID to be transferred
    IN new_team_id INT  -- ID of the new team the player will join
)
BEGIN
    DECLARE old_team_id INT;   -- Temporarily stores the player's current team ID

    -- Fetch the player's current team and store it in "old_team"
    SELECT team_id INTO old_team_id FROM Players WHERE player_id = player;
    -- Start the transaction
    START TRANSACTION;
        -- Update the player's team to the new team
        UPDATE Players SET team_id = new_team_id WHERE player_id = player;
        -- Log this action into AuditLogs
        INSERT INTO AuditLogs(action_type, table_name, action_details, performed_by)
        VALUES (
            'UPDATE',
            'Players',
            CONCAT('Player ID ', player, 
                   ' transferred from team ', old_team_id, 
                   ' to team ', new_team_id),
            CURRENT_USER()  -- The database user performing the action
        );
    -- Complete the transaction
    COMMIT;
END