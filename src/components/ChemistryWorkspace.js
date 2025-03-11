import React from 'react';
import './ChemistryWorkspace.css';

const ChemistryWorkspace = ({ items, onSelectItem, removeItem }) => {
  return (
    <div className="chem-workspace">
      <div className="workspace-header">
        <h2>Chemistry Lab Workspace (Simulation Mode)</h2>
        <p>Use Previous/Next to step through the experiment.</p>
      </div>
      <div className="lab-bench">
        <div className="lab-items">
          {items.map((item) => {
            const borderColor = item.properties?.color || "#aaa";

            return (
              <div
                key={item.id}
                className="lab-item"
                onClick={() => onSelectItem(item)}
                style={{ borderColor }}
              >
                <img
                  src={item.imageSrc}
                  alt={item.name}
                  width="60"
                  height="60"
                  className="apparatus-img"
                />
                <div className="item-label">{item.name}</div>
                <div className="item-details">
                  {item.chemicals && item.chemicals.length > 0 ? (
                    <ul className="chemical-list">
                      {item.chemicals.map((chem, idx) => (
                        <li key={idx}>
                          <span className="chem-icon">⚗️</span>
                          <strong>{chem.name}</strong> 
                          &nbsp;({chem.amount}{chem.unit || ""})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="no-chemicals">No chemicals added yet.</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChemistryWorkspace;
