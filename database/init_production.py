import mysql.connector
import os

# Path to your SQL file
sql_file_path = 'createTables.sql'


# Connect to MySQL
connection = mysql.connector.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    user='your_username',
    password='your_password'
)

cursor = connection.cursor()

# Read the SQL file
with open(sql_file_path, 'r') as file:
    sql_script = file.read()

# Split statements by ';'
sql_commands = sql_script.strip().split(';')

try:
    for statement in sql_commands:
        stmt = statement.strip()
        if stmt:
            cursor.execute(stmt)
    connection.commit()
    print("Database and tables created successfully!")
except mysql.connector.Error as err:
    print("Error: ", err)
finally:
    cursor.close()
    connection.close()