# Accessing Database

Step 1: Connect to mysql

```
mysql -u root -p
## if you do not have a admin account, run this to create one:
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'securepassword';
## then run this to grant all privileges to the admin account:
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'localhost';
```

Step 2: Creating databases & tables using createTables.sql

```
source database/createTables.sql
```

Step 3: Once you done with the above steps, you can create a .env file in the database folder and add the following variables:

```
DB_HOST=localhost
DB_NAME='your_database_name' (soccer_app)
DB_USER='your_username'
DB_PASSWORD='your_password'
```

Step 4: Populate sample data to tables

```
python populateTables.py
```

You should see messages saying that "Data imported successfully."

Step 5: Double-check that sample data has been loaded

```
SELECT * FROM APP_USERS;
```

OR: to populate the tables, run the following commands:

```
mysql -u root -p < database/createTables.sql
python database/populateTables.py
```
