import React from "react";
import PropTypes from "prop-types";

const Showcase = ({ title, description, ctaText, bgImage }) => {
  return (
    <div
      className="showcase"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
    >
      <div className="showcase-container">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="showcase-cta">
          <button className="btn-primary">{ctaText}</button>
        </div>
      </div>
    </div>
  );
};

Showcase.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  ctaText: PropTypes.string,
  bgImage: PropTypes.string,
};

export default Showcase;
