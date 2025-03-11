import React from 'react';
import './StepControls.css';

const StepControls = ({ currentStepIndex, totalSteps, onPrev, onNext }) => {
  return (
    <div className="step-controls">
      <button onClick={onPrev} disabled={currentStepIndex === 0}>
        Previous
      </button>
      <span className="step-info">
        Step {currentStepIndex} of {totalSteps}
      </span>
      <button onClick={onNext} disabled={currentStepIndex >= totalSteps}>
        Next
      </button>
    </div>
  );
};

export default StepControls;
