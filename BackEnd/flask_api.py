from flask import Flask, request, send_file
import pandas as pd
import pickle
from io import StringIO, BytesIO, BytesIO
import shap
import matplotlib.pyplot as plt
import numpy as np
import zipfile
from tensorflow.keras.models import load_model
from flask_cors import CORS  # Import the CORS module


app = Flask(__name__)
CORS(app) 

with open('models_and_scalers/xgboost_model.pkl', 'rb') as file:
    xgboost_model = pickle.load(file)




with open('models_and_scalers/FF_NN_DeepSHAP_model_standard_scaler.pkl', 'rb') as scaler_file:
    FF_NN_DeepSHAP_model_scaler = pickle.load(scaler_file)

FF_NN_DeepSHAP_model = load_model('models_and_scalers/FF_NN_DeepSHAP_model.h5')



def get_tree_shap_explanation(input_features, model):
    # Load the SHAP explainer
    tree_shap_explainer = shap.TreeExplainer(model)
    # Get SHAP values for the predictions
    shap_values = tree_shap_explainer.shap_values(input_features)

    shap.summary_plot(shap_values, input_features, show=False)

    explanation_image_bytes = BytesIO()
    plt.savefig(explanation_image_bytes, format='png')
    explanation_image_bytes.seek(0)
    return explanation_image_bytes



def get_deep_shap_explanation(input_features, model):
    # Load the SHAP explainer
    deep_shap_explainer = shap.DeepExplainer(model, data=input_features)
    # Get SHAP values for the predictions
    print('\n\nGetting DeepSHAP values...\n\n')
    shap_values = deep_shap_explainer.shap_values(input_features)

    shap.summary_plot(shap_values, input_features, show=False)

    explanation_image_bytes = BytesIO()
    plt.savefig(explanation_image_bytes, format='png')
    explanation_image_bytes.seek(0)
    return explanation_image_bytes



@app.route('/xgboost_treeshap_predict_csv', methods=['POST'])
def xgboost_treeshap_predict_csv():
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']

    # If the user does not select a file, the browser submits an empty file without a filename
    if file.filename == '':
        return 'No selected file'

    # Read the CSV data from the file
    csv_data = file.read().decode('utf-8')

    df = pd.read_csv(StringIO(csv_data))

    input_features = df[['LIMIT_BAL', 'SEX', 'EDUCATION', 'MARRIAGE', 'AGE', 'PAY_0', 'PAY_2',
                         'PAY_3', 'PAY_4', 'PAY_5', 'PAY_6', 'BILL_AMT1', 'BILL_AMT2',
                         'BILL_AMT3', 'BILL_AMT4', 'BILL_AMT5', 'BILL_AMT6', 'PAY_AMT1',
                         'PAY_AMT2', 'PAY_AMT3', 'PAY_AMT4', 'PAY_AMT5', 'PAY_AMT6']]

    # Make predictions
    predictions = xgboost_model.predict(input_features)

    # Append predictions to a new column
    df['predictions'] = predictions

    # Convert the DataFrame to CSV
    output_csv = df.to_csv(index=False)

    # Convert CSV data to BytesIO object
    output_bytes = BytesIO(output_csv.encode('utf-8'))

    explanation_image_bytes = get_tree_shap_explanation(input_features, xgboost_model)

    # Create a zip file containing both the CSV file and the explanation image
    zip_bytes = BytesIO()
    with zipfile.ZipFile(zip_bytes, 'w') as zip_file:
        zip_file.writestr('predictions.csv', output_csv)
        zip_file.writestr('explanation.png', explanation_image_bytes.getvalue())

    zip_bytes.seek(0)

    # Return the zip file as a response
    return send_file(zip_bytes, download_name='output.zip', as_attachment=True)

###### XGboost + DeepSHAP not there, xgboost model not supported for deepshap




@app.route('/ff_nn_deepshap_predict_csv', methods=['POST'])
def ff_nn_deepshap_predict_csv():
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']

    # If the user does not select a file, the browser submits an empty file without a filename
    if file.filename == '':
        return 'No selected file'

    # Read the CSV data from the file
    csv_data = file.read().decode('utf-8')

    df = pd.read_csv(StringIO(csv_data))

    input_features = df[['LIMIT_BAL', 'SEX', 'EDUCATION', 'MARRIAGE', 'AGE', 'PAY_0', 'PAY_2',
                         'PAY_3', 'PAY_4', 'PAY_5', 'PAY_6', 'BILL_AMT1', 'BILL_AMT2',
                         'BILL_AMT3', 'BILL_AMT4', 'BILL_AMT5', 'BILL_AMT6', 'PAY_AMT1',
                         'PAY_AMT2', 'PAY_AMT3', 'PAY_AMT4', 'PAY_AMT5', 'PAY_AMT6']]
    
    # Make predictions
    input_features = FF_NN_DeepSHAP_model_scaler.transform(input_features.values)

    predictions = FF_NN_DeepSHAP_model.predict(input_features)
    predictions = (predictions > 0.5).astype(int)

    # Append predictions to a new column
    df['predictions'] = predictions

    # Convert the DataFrame to CSV
    output_csv = df.to_csv(index=False)

    # Convert CSV data to BytesIO object
    output_bytes = BytesIO(output_csv.encode('utf-8'))

    explanation_image_bytes = get_deep_shap_explanation(input_features, FF_NN_DeepSHAP_model)

    # Create a zip file containing both the CSV file and the explanation image
    zip_bytes = BytesIO()
    with zipfile.ZipFile(zip_bytes, 'w') as zip_file:
        zip_file.writestr('predictions.csv', output_csv)
        zip_file.writestr('explanation.png', explanation_image_bytes.getvalue())

    zip_bytes.seek(0)

    # Return the zip file as a response
    return send_file(zip_bytes, download_name='output.zip', as_attachment=True)


# FF NN + TreeSHAP is not supported



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

