#!/bin/bash

# Navigate to the FrontEnd folder
echo "Navigating to FrontEnd folder..."
cd FrontEnd

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Run the frontend project
echo "Running the frontend project..."
npm start dev &

# Move back to the main folder
echo "Moving back to the main folder..."
cd ..

# Navigate to the BackEnd folder
echo "Navigating to BackEnd folder..."
cd BackEnd

# Check if Python 3.8 is available
if command -v python3.8 &> /dev/null; then
    echo "Python 3.8 is installed."
else
    echo "Python 3.8 is required for this project."
    echo "You can install it on Linux with 'yay python38' or use another method."
    read -p "Press Enter to continue..."
fi

# Starting Virtual Environment and running subsequent commands
echo "Starting Virtual Environment and installing backend dependencies..."
pipenv run pip install -r requirements.txt

# Run the Flask API
echo "Running the Flask API..."
pipenv run python flask_api.py
