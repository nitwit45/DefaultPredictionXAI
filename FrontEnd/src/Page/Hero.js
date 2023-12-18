import React from "react";
import IMAGES from "../Assets/Images";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <>
      <section>
        <header className="header">
          <div className="header__img">
            <img src={IMAGES.logo} alt="logo" />
          </div>
          <h1>The Next Generation of Fraud Detection</h1>
          <p className="desktop__text">
            Empowering Financial Decision-Making: A Comprehensive
            Analysis and Prediction of Credit Card Default using
            Advanced XAI Techniques.
          </p>

          <div className="buttons">
            {/* Use target="_blank" to open the link in a new tab */}
            <Link to="/predict">Predict Now</Link>
            {/* Replace "" with the actual GitHub URL */}
            <a href="www.github.com" target="_blank">
              View GitHub
            </a>
          </div>
        </header>
      </section>
    </>
  );
}

export default Hero;
