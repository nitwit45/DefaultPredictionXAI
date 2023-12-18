import React, { useState, useEffect } from "react";
import IMAGES from "../Assets/Images";
import JSZip from 'jszip';


function Predict() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedXAITechnique, setSelectedXAITechnique] = useState(null);
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [explanationUrl, setExplanationUrl] = useState(null); // New state for explanation image URL

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
    // Reset the previous messages and explanation image URL
    setErrorMessage(null);
    setSuccessMessage(null);
    setExplanationUrl(null);

    // Ensure that both model, XAI technique, and file are selected
    if (selectedModel === "xgboost" && selectedXAITechnique === "treeshap" && file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Make a POST request to the Flask API
        const response = await fetch("http://0.0.0.0:5000/xgboost_treeshap_predict_csv", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          // Handle the successful response
          const zipBlob = await response.blob();

          // Unzip the contents using JSZip
          const zip = new JSZip();
          const unzipped = await zip.loadAsync(zipBlob);

          // Check if the explanation.png file exists
          if (unzipped.files["explanation.png"]) {
            // Get the content of the explanation.png file
            const explanationBlob = await unzipped.file("explanation.png").async("blob");

            // Set the explanation image URL
            const url = window.URL.createObjectURL(explanationBlob);
            setExplanationUrl(url);

            // Set the success message
            setSuccessMessage("Prediction successful! Explanation.png displayed.");
          } else {
            // Set an error message if explanation.png is not found
            setErrorMessage("Explanation.png not found in the zip file.");
          }
        } else {
          // Handle error response and set the error message
          const errorText = await response.text();
          setErrorMessage(`Error: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        // Handle other errors and set the error message
        setErrorMessage(`Error: ${error.message}`);
      }
    } else {
      // Handle case where not all required fields are selected
      setErrorMessage("Please select model, XAI technique, and upload a file.");
    }
  };

  const handleDownloadZip = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://0.0.0.0:5000/xgboost_treeshap_predict_csv", {
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
    // Update the button text when the selectedModel changes
    const dropdownButton = document.getElementById("dropdown-button-1");
    if (dropdownButton) {
      dropdownButton.innerText = selectedModel ? selectedModel : "Select Model";
    }
  }, [selectedModel]);

  useEffect(() => {
    // Update the button text when the selectedXAITechnique changes
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

        {/* First dropdown */}
        <div className="dropdown">
          <button id="dropdown-button-1" className="dropbtn">
            {selectedModel ? selectedModel : "Select Model"}
          </button>
          <div className="dropdown-content">
            <button onClick={() => handleModelSelect("xgboost")}>xgboost</button>
            <button onClick={() => handleModelSelect("Model 2")}>Model 2</button>
            <button onClick={() => handleModelSelect("Model 3")}>Model 3</button>
            {/* Add more buttons as needed */}
          </div>
        </div>

        {/* Second dropdown */}
        <div className="dropdown">
          <button id="dropdown-button-2" className="dropbtn">
            {selectedXAITechnique ? selectedXAITechnique : "Select XAI Technique"}
          </button>
          <div className="dropdown-content">
            <button onClick={() => handleXAITechniqueSelect("treeshap")}>treeshap</button>
            <button onClick={() => handleXAITechniqueSelect("Model B")}>Model B</button>
            <button onClick={() => handleXAITechniqueSelect("Model C")}>Model C</button>
            {/* Add more buttons as needed */}
          </div>
        </div>

        {/* File upload section */}
        <div className="upload-container">
          <h3 className="upload-heading">Upload CSV File</h3>
          <label htmlFor="file" className="custom-file-input">
            Choose File
          </label>
          <input type="file" id="file" className="file-input" accept=".csv" onChange={handleFileChange} />
          <p className="file-name">{file ? file.name : "No file chosen"}</p>
        </div>

        {/* Run Prediction button */}
        <button onClick={handleRunPrediction}>Run Prediction</button>

        {/* Download ZIP button */}
        <button className="downloadbtn" onClick={handleDownloadZip}>Download ZIP</button>

        {/* Display success message */}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {/* Display explanation image */}
        {explanationUrl && (
          <div className="explanation-container">
            <h3 className="explanation-heading">Explanation Image</h3>
            <img src={explanationUrl} alt="Explanation" />
          </div>
        )}

        {/* Display error message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </header>
    </div>
  );
}

export default Predict;
