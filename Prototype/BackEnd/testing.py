# import requests
# import pandas as pd

# # URL of the Flask API endpoint
# api_url = 'http://127.0.0.1:5000/xgboost_treeshap_predict_csv'

# # Path to your CSV file
# csv_file_path = './test_data.csv'

# # Read the CSV file
# csv_data = pd.read_csv(csv_file_path)

# # Send a POST request to the Flask API with the CSV file
# files = {'file': ('input_data.csv', csv_data.to_csv(index=False))}
# response = requests.post(api_url, files=files)

# # Check the response
# if response.status_code == 200:
#     # Save the zip file
#     with open('output.zip', 'wb') as f:
#         f.write(response.content)

#     print('Output zip file received and saved.')
# else:
#     print(f'Error: {response.status_code} - {response.text}')


import requests
import pandas as pd

# URL of the Flask API endpoint
api_url = 'http://127.0.0.1:5000/ff_nn_deepshap_predict_csv'

# Path to your CSV file
csv_file_path = './test_data.csv'

# Read the CSV file
csv_data = pd.read_csv(csv_file_path)

# Send a POST request to the Flask API with the CSV file
files = {'file': ('input_data.csv', csv_data.to_csv(index=False))}
response = requests.post(api_url, files=files)

# Check the response
if response.status_code == 200:
    # Save the zip file
    with open('output.zip', 'wb') as f:
        f.write(response.content)

    print('Output zip file received and saved.')
else:
    print(f'Error: {response.status_code} - {response.text}')





