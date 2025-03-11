import React from 'react';
import './StepControls.css';

const StepControls = ({ currentStepIndex, totalSteps, onPrev, onNext }) => {
  return (
    <div className="step-controls">
      <button onClick={onPrev} disabled={currentStepIndex === 0}>
        Previous
      </button>
      <span className="step-info">
        Step {currentStepIndex + 1} of {totalSteps}
      </span>
      <button onClick={onNext} disabled={currentStepIndex >= totalSteps - 1}>
        Next
      </button>
    </div>
  );
};

export default StepControls;
