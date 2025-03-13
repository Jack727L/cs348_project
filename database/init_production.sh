#!/bin/bash
# Install required Python packages
echo "📦 Installing dependencies..."
pip install mysql-connector-python pandas python-dotenv Faker

# Check installation success
if [ $? -ne 0 ]; then
  echo "❌ Error installing Python dependencies."
  exit 1
fi

echo "✅ Dependencies installed."

echo "Starting production initialization..."

# Execute the initial database setup script
python init_production.py
if [ $? -ne 0 ]; then
  echo "Failed to execute init_production.py"
  exit 1
fi

echo "Database initialized successfully."

# Populate tables with production data
echo "Populating tables with production data..."
python ./production_data/newPopulateTables.py

if [ $? -eq 0 ]; then
    echo "Production data populated successfully."
else
    echo "Error populating production data."
    exit 1
fi

echo "Production initialization completed successfully!"