---- SignUp: check if username already exist
SELECT * FROM app_user 
WHERE username = 'test1'

---- SignUp: insert new user if username does not exist
INSERT INTO app_user(username, password, role) 
VALUES ('test1', 'password1', 'user')

---- LogIn: check if (username, password) corresponds to a specific user
SELECT * FROM app_user 
WHERE username = 'test1' AND password = 'password1'