# cs348_project

# If using python3

You have to create an venv:
python3 -m venv venv

source venv/bin/activate


## Setup the project

You have to setup the project on your local machine, and please follow the following steps in sequential order

Step 1: Install the requirements under the backend folder

```
cd backend/routes
pip install -r requirements.txt
```

Step 2: Install MySQL on your local machine

```
if you are using windows, you can download the MySQL installer from the official website.
if you are using mac, you can use homebrew to install MySQL.
```

Step 3: Test access the MySQL server

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
DB_NAME=soccer_app
DB_USER=your_username
DB_PASSWORD=your_password
```

Step 5: Auto-populate the database

```
We have created an auto-populate script for you to populate the database, run following command to populate the database:
mysql -u root -p < database/createTables.sql
python3 database/new_data_sets/populateTables.py
```

Step 6: Run the backend

```
python backend/routes/app.py
this will start the backend server with fastapi, you can access the api documentation locally with your local host.
```

Step 7: Run the frontend
navigate to the frontend folder and run the following command:

```
npm start
```
