import React from 'react';
import './TopBar.css';

const TopBar = ({ experimentName = "No Experiment", currentStep = { number: 0, name: "Not Defined" } }) => {
  return (
    <div className="top-bar">
      <h1>{experimentName}</h1>
      <div className="step-info">
        <span>Step {currentStep.number}: {currentStep.name}</span>
      </div>
    </div>
  );
};

export default TopBar;
