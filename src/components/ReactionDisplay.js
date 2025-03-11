import React from 'react';
import './ReactionDisplay.css';

const ReactionDisplay = ({ workspaceItems }) => {
  // For each apparatus, build a string of all chemicals
  const reactionList = workspaceItems.map(item => {
    if (item.chemicals.length === 0) {
      return null;
    }
    const chemicalsStr = item.chemicals
      .map(c => `${c.name}(${c.amount}${c.unit || ""})`)
      .join(" + ");
    return `${item.name}: ${chemicalsStr}`;
  }).filter(r => r !== null);

  return (
    <div className="reaction-display">
      <h3>Current Chemical Equation</h3>
      {reactionList.length > 0 ? (
        <ul>
          {reactionList.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      ) : (
        <p>No reaction yet.</p>
      )}
    </div>
  );
};

export default ReactionDisplay;
