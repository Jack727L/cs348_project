USE soccer_app;

-- SignUp: check if username already exist
SELECT * FROM Users
WHERE username = 'test1'

-- SignUp: insert new user if username does not exist
INSERT INTO Users(username, password, email, role_id) 
VALUES ('test1', 'password1', 'test1@example.com', 2)

-- LogIn: check if (username, password) corresponds to a specific user
SELECT * FROM Users 
WHERE username = 'test1' AND password = 'password1'