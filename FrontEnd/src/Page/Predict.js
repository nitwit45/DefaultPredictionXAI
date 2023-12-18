import React, { useState, useEffect } from "react";
import IMAGES from "../Assets/Images";
import JSZip from 'jszip';

function Predict() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedXAITechnique, setSelectedXAITechnique] = useState(null);
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [explanationUrl, setExplanationUrl] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [displayedRows, setDisplayedRows] = useState(10);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleXAITechniqueSelect = (technique) => {
    setSelectedXAITechnique(technique);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  const handleRunPrediction = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setExplanationUrl(null);
    setCsvData(null);

    if (selectedModel && selectedXAITechnique && file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        let endpoint;

        if (selectedModel === "xgboost" && selectedXAITechnique === "treeshap") {
          endpoint = "http://0.0.0.0:5000/xgboost_treeshap_predict_csv";
        } else if (selectedModel === "ff_nn" && selectedXAITechnique === "deepshap") {
          endpoint = "http://0.0.0.0:5000/ff_nn_deepshap_predict_csv";
        } else {
          setErrorMessage("Selected model and XAI technique are not compatible.");
          return;
        }

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const zipBlob = await response.blob();
          const zip = new JSZip();
          const unzipped = await zip.loadAsync(zipBlob);

          if (unzipped.files["explanation.png"] && unzipped.files["predictions.csv"]) {
            const explanationBlob = await unzipped.file("explanation.png").async("blob");
            const url = window.URL.createObjectURL(explanationBlob);
            setExplanationUrl(url);

            const csvText = await unzipped.file("predictions.csv").async("text");
            setCsvData(csvText);

            setSuccessMessage("Prediction successful! Explanation.png and predictions.csv displayed.");
          } else {
            setErrorMessage("Explanation.png or predictions.csv not found in the zip file.");
          }
        } else {
          const errorText = await response.text();
          setErrorMessage(`Error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        setErrorMessage(`Error: ${error.message}`);
      }
    } else {
      setErrorMessage("Please select model, XAI technique, and upload a file.");
    }
  };

  const handleDownloadZip = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      let endpoint;

      if (selectedModel === "xgboost" && selectedXAITechnique === "treeshap") {
        endpoint = "http://0.0.0.0:5000/xgboost_treeshap_predict_csv";
      } else if (selectedModel === "ff_nn" && selectedXAITechnique === "deepshap") {
        endpoint = "http://0.0.0.0:5000/ff_nn_deepshap_predict_csv";
      } else {
        setErrorMessage("Selected model and XAI technique are not compatible.");
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "output.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const errorText = await response.text();
        setErrorMessage(`Error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const dropdownButton = document.getElementById("dropdown-button-1");
    if (dropdownButton) {
      dropdownButton.innerText = selectedModel ? selectedModel : "Select Model";
    }
  }, [selectedModel]);

  useEffect(() => {
    const dropdownButton = document.getElementById("dropdown-button-2");
    if (dropdownButton) {
      dropdownButton.innerText = selectedXAITechnique ? selectedXAITechnique : "Select XAI Technique";
    }
  }, [selectedXAITechnique]);

  return (
    <div className="predict-container">
      <header className="header">
        <div className="header__img">
          <img src={IMAGES.logo} alt="logo" />
        </div>
        <h1>Choose Your Models and Upload the CSV File Here</h1>
        <p className="desktop__text">Below are the input fields</p>
        <p className="desktop__text">Choose Model and XAI Technique</p>

        <div className="dropdown">
          <button id="dropdown-button-1" className="dropbtn">
            {selectedModel ? selectedModel : "Select Model"}
          </button>
          <div className="dropdown-content">
            <button onClick={() => handleModelSelect("xgboost")}>xgboost</button>
            <button onClick={() => handleModelSelect("ff_nn")}>Feedforward NN</button>
          </div>
        </div>

        <div className="dropdown">
          <button id="dropdown-button-2" className="dropbtn">
            {selectedXAITechnique ? selectedXAITechnique : "Select XAI Technique"}
          </button>
          <div className="dropdown-content">
            <button onClick={() => handleXAITechniqueSelect("treeshap")}>treeshap</button>
            <button onClick={() => handleXAITechniqueSelect("deepshap")}>DeepSHAP</button>
          </div>
        </div>

        <div className="upload-container">
          <h3 className="upload-heading">Upload CSV File</h3>
          <label htmlFor="file" className="custom-file-input">
            Choose File
          </label>
          <input type="file" id="file" className="file-input" accept=".csv" onChange={handleFileChange} />
          <p className="file-name">{file ? file.name : "No file chosen"}</p>
        </div>

        <button onClick={handleRunPrediction}>Run Prediction</button>

        <button className="downloadbtn" onClick={handleDownloadZip}>Download ZIP</button>

        {successMessage && <p className="success-message">{successMessage}</p>}

        {explanationUrl && (
          <div className="explanation-container">
            <h3 className="explanation-heading">Explanation Image</h3>
            <img src={explanationUrl} alt="Explanation" />
          </div>
        )}

        {csvData && (
          <div className="csv-container">
            <h3 className="csv-heading">Predictions CSV Data</h3>
            <table className="csv-table">
              <thead>
                <tr>
                  {csvData.split('\n')[0].split(',').map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.split('\n').slice(1, displayedRows + 1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.split(',').map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {csvData.split('\n').length > displayedRows + 1 && (
              <button onClick={() => setDisplayedRows(displayedRows + 10)}>
                Show More Rows
              </button>
            )}
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </header>
    </div>
  );
}

export default Predict;
