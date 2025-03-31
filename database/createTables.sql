DROP DATABASE IF EXISTS soccer_app;
CREATE DATABASE soccer_app;
USE soccer_app;

CREATE TABLE Country(
    country_id INT PRIMARY KEY,
    countryname VARCHAR(100) NOT NULL UNIQUE,
    CHECK (countryname <> '')
);

-- Create Leagues
CREATE TABLE Leagues(
    league_id INT PRIMARY KEY,
    leaguename VARCHAR(100) NOT NULL,
    league_nationality_id INT NULL,
    CHECK (leaguename <> ''),
    FOREIGN KEY (league_nationality_id) REFERENCES Country(country_id) ON DELETE SET NULL
);

-- Create Roles
CREATE TABLE Roles(
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    rolename VARCHAR(255) NOT NULL UNIQUE,
    CHECK (rolename <> '')
);

-- Create Users
CREATE TABLE Users(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE SET NULL
);

-- Create Teams
CREATE TABLE Teams(
    team_id INT PRIMARY KEY,
    teamname VARCHAR(100) NOT NULL,
    league_id INT NOT NULL,
    CHECK (teamname <> ''),
    FOREIGN KEY (league_id) REFERENCES Leagues(league_id) ON DELETE CASCADE
);

-- Create Players
CREATE TABLE Players(
    player_id INT PRIMARY KEY,
    playername VARCHAR(100) NOT NULL,
    team_id INT NOT NULL,
    position ENUM('GK', 'DEF', 'MID', 'FWD') NOT NULL,
    player_nationality_id INT NULL,
    age INT,
    CHECK (playername <> ''),
    CHECK (age IS NULL OR (age > 0)),
    FOREIGN KEY (team_id) REFERENCES Teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (player_nationality_id) REFERENCES Country(country_id) ON DELETE SET NULL,
    FULLTEXT INDEX playername_fulltext (playername)
);

-- Create Matches
CREATE TABLE Matches(
    match_id INT PRIMARY KEY,
    date DATE NOT NULL,
    match_location VARCHAR(255) NOT NULL,
    hometeam_score INT DEFAULT 0,
    awayteam_score INT DEFAULT 0,
    hometeam_id INT NOT NULL,
    awayteam_id INT NOT NULL,
    league_id INT NOT NULL,
    CHECK (hometeam_score >= 0),
    CHECK (awayteam_score >= 0),
    CHECK (hometeam_id <> awayteam_id),
    FOREIGN KEY (hometeam_id) REFERENCES Teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (awayteam_id) REFERENCES Teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (league_id) REFERENCES Leagues(league_id) ON DELETE CASCADE
);

-- Create Statistics
CREATE TABLE Statistics(
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    goal INT NOT NULL DEFAULT 0,
    pass_acc DECIMAL (5, 2) NOT NULL DEFAULT 0,
    assist INT NOT NULL DEFAULT 0,
    playtime INT NOT NULL DEFAULT 0,
    PRIMARY KEY (match_id, player_id),
    CHECK (goal >= 0),
    CHECK (assist >= 0),
    CHECK (playtime >= 0),
    CHECK (pass_acc BETWEEN 0 AND 100),
    FOREIGN KEY (match_id) REFERENCES Matches(match_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE
);

-- Create FavoriteTeams
CREATE TABLE FavoriteTeams(
    user_id INT,
    team_id INT,
    dateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, team_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES Teams(team_id) ON DELETE CASCADE
);

-- Create FavoritePlayers
CREATE TABLE FavoritePlayers(
    user_id INT,
    player_id INT,
    dateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, player_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE
);

-- Create Notifications
CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


-- Create AuditLogs
CREATE TABLE AuditLogs(
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE'),
    table_name VARCHAR(100),
    action_details TEXT,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    performed_by VARCHAR(100)
);

-- Index
CREATE INDEX idx_players_team_id ON Players(team_id);