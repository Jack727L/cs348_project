from flask import Flask, render_template
import mysql.connector
from mysql.connector import Error
import os

app = Flask(__name__)

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/')
def index():
    connection = get_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM student;")
        rows = cursor.fetchall()
        cursor.close()
        connection.close()
        return render_template('index.html', students=rows)
    else:
        return "Failed to connect to the database."

if __name__ == '__main__':
    app.run(debug=True)