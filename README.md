# cs348_project

Step 1: Install the requirements under the backend folder

```
pip install -r requirements.txt
```

Step 2: Install MySQL on your local machine

```
if you are using windows, you can download the MySQL installer from the official website.
if you are using mac, you can use homebrew to install MySQL.
```

Step 3: Access the MySQL server

```
mysql -u root -p
if you do not have a admin account, run this to create one:
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'securepassword';
then run this to grant all privileges to the admin account:
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost';
```

Step 4: Once you done with the above steps, you can create a .env file in the backend folder and add the following variables:

```
DB_HOST=localhost
DB_NAME='your_database_name'
DB_USER='your_username'
DB_PASSWORD='your_password'
```

Step 5: Run the app

```
python app.py
```
