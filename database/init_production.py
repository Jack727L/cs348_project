import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

# General schema file
schema_path = 'createTables.sql'
# Trigger file
trigger_path = 'triggers.sql'

connection = mysql.connector.connect(
    host=os.getenv('DB_HOST', 'localhost'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD')
)

cursor = connection.cursor()

# Step 1: Run basic schema commands (split safely)
with open(schema_path, 'r') as file:
    schema_sql = file.read()

for statement in schema_sql.strip().split(';'):
    stmt = statement.strip()
    if stmt:
        try:
            cursor.execute(stmt)
        except mysql.connector.Error as err:
            print("Schema Error:", err)

# Step 2: Run trigger/event block in full
with open(trigger_path, 'r') as file:
    trigger_sql = file.read()

try:
    for result in cursor.execute(trigger_sql, multi=True):
        pass  # consume result
    connection.commit()
    print("Trigger/event created successfully!")
except mysql.connector.Error as err:
    print("Trigger/Event Error:", err)

cursor.close()
connection.close()