USE soccer_app;

-- SignUp: check if username already exist
SELECT * FROM Users
WHERE username = 'test3';

-- SignUp: insert new user if username does not exist
INSERT INTO Users(username, password, email, role_id) 
VALUES ('test3', 'password3', 'test3@example.com', 2);

-- LogIn: check if (username, password) corresponds to a specific user
SELECT * FROM Users 
WHERE username = 'test3' AND password = 'password3';