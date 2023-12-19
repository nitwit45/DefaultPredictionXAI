@echo off

rem Navigate to the FrontEnd folder
echo Navigating to FrontEnd folder...
cd FrontEnd

rem Install frontend dependencies
echo Installing frontend dependencies...
npm install

rem Run the frontend project
echo Running the frontend project...
npm start dev

rem Move back to the main folder
echo Moving back to the main folder...
cd ..

rem Navigate to the BackEnd folder
echo Navigating to BackEnd folder...
cd BackEnd

rem Check if Python 3.8 is available
where python3.8 >nul 2>nul
if %errorlevel% equ 0 (
    echo Python 3.8 is installed.
) else (
    echo Python 3.8 is required for this project.
    echo You can install it on Windows and use another method.
    pause
    exit /b 1
)

rem Starting Virtual Environment and running subsequent commands
echo Starting Virtual Environment and installing backend dependencies...
pipenv run pip install -r requirements.txt

rem Run the Flask API
echo Running the Flask API...
pipenv run python flask_api.py

rem Pause at the end
pause
