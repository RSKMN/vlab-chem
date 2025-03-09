import React from 'react';
import './ChemistryWorkspace.css';

const ChemistryWorkspace = ({ items, onSelectItem }) => {
  return (
    <div className="chem-workspace">
      <div className="lab-bench">
        <h2>Chemistry Lab Workspace</h2>
        <p>Drag and drop your apparatus here or click to select.</p>
        <div className="lab-items">
          {items && items.map(item => (
            <div 
              key={item.id} 
              className="lab-item" 
              onClick={() => onSelectItem(item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChemistryWorkspace;

