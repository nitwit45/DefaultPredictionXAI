import React from "react";
import IMAGES from "../Assets/Images";

function Snippets() {
  return (
    <>
      <section className="snippets">
        <div className="snippets__head">
          <h2>What is Credit Card Fraud?</h2>
          <p className="desktop__text">
          "Credit card fraud: Unauthorized use of cards for purchases or cash advances, 
          involving physical theft or digital means to access personal information for 
          illicit transactions.
          </p>
        </div>
        <div className="snippets__body">
          <div className="snippets__body__img">
            <img src={IMAGES.computer} alt="computers" />
          </div>
          <div className="snippets__body__text">
            <h3>Chip-activated terminals</h3>
            <p>
            A unique, one-time authorisation code protects chip card transactions.
            </p>

            <h3>Verified by Visa </h3>
            <p>The cardholder enters a password to verify their identity, which is confirmed by the card issuer in real time.</p>

            <h3>Cybersource</h3>
            <p>
            Services for processing online payments, streamlining fraud management and simplifying payment security.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Snippets;
