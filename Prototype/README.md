# DefaultGuardian

DefaultGuardian is a machine learning project that predicts credit card default. It employs the XGBoost model for accurate predictions and utilizes the TreeSHAP (SHapley Additive exPlanations) explainability technique to provide insights into the model's decisions.

## Overview

The main goal of DefaultGuardian is to predict whether a credit card user is likely to default on their payments. This project is built on the XGBoost model, a powerful machine learning algorithm known for its effectiveness in classification tasks. The use of TreeSHAP allows for interpretability, providing explanations for individual predictions.

## Requirements

- **Python 3.8**: Ensure you have Python 3.8 installed. You can install it on Linux using 'yay python38', on macOS using 'brew install python@3.8', or through another method on Windows.

- **Node.js**: Make sure you have Node.js installed for the frontend. You can download it from [nodejs.org](https://nodejs.org/).

## Installation

### Linux & macOS

To run the project on Linux or macOS, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/DefaultGuardian.git
    cd DefaultGuardian
    ```

2. Run the provided script to set up and run both the backend and frontend:

    ```bash
    ./linux_mac_run.sh
    ```

    This script installs backend dependencies, sets up a virtual environment, and runs the Flask API along with the frontend.

### Windows

For Windows users, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/DefaultGuardian.git
    cd DefaultGuardian
    ```

2. Run the provided batch file to set up and run both the backend and frontend:

    ```batch
    windows_run.bat
    ```

    This batch file installs backend dependencies, sets up a virtual environment, and runs the Flask API along with the frontend.

## Model and XAI Technique

DefaultGuardian uses the XGBoost model to predict credit card default. The TreeSHAP explainability technique is applied to enhance the interpretability of the model's decisions.
