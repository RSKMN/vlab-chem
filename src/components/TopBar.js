import React from 'react';
import './TopBar.css';

const TopBar = ({ experimentName, currentStep }) => {
  return (
    <div className="top-bar">
      <div className="experiment-name">Experiment Name: {experimentName}</div>
      <div className="step-info">
        <span className="step-number">Step {currentStep.number}</span>
        <span className="step-name">{currentStep.name}</span>
      </div>
    </div>
  );
};

export default TopBar;

