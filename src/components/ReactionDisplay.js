import React from 'react';
import './ReactionDisplay.css';

const ReactionDisplay = ({ workspaceItems }) => {
  const reactionList = workspaceItems.map((item) => {
    const { contents } = item.properties;
    if (contents.chemical && contents.chemical.trim() !== "") {
      return `${item.name}: ${contents.chemical} (${contents.amount}${contents.unit || ""})`;
    }
    return null;
  }).filter(r => r !== null);

  return (
    <div className="reaction-display">
      <h3>Current Chemical Equation</h3>
      {reactionList.length > 0 ? (
        <ul>
          {reactionList.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      ) : (
        <p>No reaction yet.</p>
      )}
    </div>
  );
};

export default ReactionDisplay;
