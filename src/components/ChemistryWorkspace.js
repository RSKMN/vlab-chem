import React, { useState } from 'react';
import './ChemistryWorkspace.css';

const ChemistryWorkspace = ({ items, onAddToWorkspace }) => {
  const [dropdownVisible, setDropdownVisible] = useState(null);

  // Toggle dropdown visibility
  const handleItemClick = (id) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  return (
    <div className="chem-workspace">
      <div className="workspace-header">
        <h2>Chemistry Lab Workspace</h2>
        <p>Drag and drop your apparatus here or click to select.</p>
      </div>

      <div className="lab-bench">
        <div className="lab-items">
          {items.map((item) => (
            <div key={item.id} className="lab-item">
              <div onClick={() => handleItemClick(item.id)}>
                {item.name}
              </div>
              
              {dropdownVisible === item.id && (
                <div className="dropdown-menu">
                  <button onClick={() => onAddToWorkspace(item)}>Add to Workspace</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChemistryWorkspace;
