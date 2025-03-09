import React from 'react';
import './SimulationControls.css';

const SimulationControls = ({ simulationStatus, onPlay, onPause, onStop }) => {
  return (
    <div className="simulation-controls">
      <button onClick={onPlay}>Play</button>
      <button onClick={onPause}>Pause</button>
      <button onClick={onStop}>Stop</button>
      <div className="status">
        Status: {simulationStatus}
      </div>
    </div>
  );
};

export default SimulationControls;

