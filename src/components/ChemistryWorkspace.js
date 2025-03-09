import React from 'react';
import './ChemistryWorkspace.css';

const ChemistryWorkspace = ({ items, onSelectItem }) => {
  return (
    <div className="chem-workspace">
      <div className="workspace-header">
        <h2>Chemistry Lab Workspace</h2>
        <p>Drag and drop your apparatus here or click to select.</p>
      </div>

      <div className="lab-bench">
        <div className="lab-items">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="lab-item"
              onClick={() => onSelectItem(item)}
            >
              {/* Show the apparatus image instead of text */}
              <img 
                src={item.imageSrc} 
                alt={item.name} 
                width="50" 
                height="50" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChemistryWorkspace;
