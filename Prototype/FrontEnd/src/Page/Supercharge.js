import React from "react";
import IMAGES from "../Assets/Images";

function Supercharge() {
  return (
    <>
      <section className="supercharge">
        <h2>Supercharge your workflow</h2>
        <p>We’ve got the tools to boost your productivity.</p>
        <div className="supercharge_items">
          <div className="item">
            <img className="resize" src={IMAGES.blacklist} alt="blacklist" />
            <h3>Card Not Present (CNP) fraud</h3>
            <p>
            Remote purchase fraud involves online transactions without the physical presence of the card.
            </p>
          </div>

          <div className="item">
            <img className="resize" src={IMAGES.text} alt="text" />
            <h3>Card Present (CP) fraud</h3>
            <p>
            In contrast, the opposite scenario requires the physical card at the point of sale (POS).
            </p>
          </div>

          <div className="item">
            <img className="resize" src={IMAGES.preview} alt="preview" />
            <h3>First-party fraud type</h3>
            <p>
            In such cases, customers may become fraudsters due to financial issues or non-payment of credit card dues.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Supercharge;
