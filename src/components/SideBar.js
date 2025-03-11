import React, { useState } from 'react';
import './SideBar.css';

const SideBar = ({ addItem, apparatusList, chemicalsList }) => {
  const [showApparatus, setShowApparatus] = useState(false);
  const [showChemicals, setShowChemicals] = useState(false);

  return (
    <div className="side-bar">
      <h3>Materials</h3>

      {/* Apparatus Dropdown */}
      <div className="dropdown">
        <button 
          className="dropdown-btn"
          onClick={() => setShowApparatus(!showApparatus)}
        >
          Apparatus {showApparatus ? '▲' : '▼'}
        </button>
        {showApparatus && (
          <div className="dropdown-content">
            {apparatusList.map((item, index) => (
              <div key={index} className="material-item">
                <img src={item.imageSrc} alt={item.name} width="50" height="50" />
                <span>{item.name}</span>
                <button onClick={() => addItem(item)}>
                  Add to Workspace
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chemicals Dropdown */}
      <div className="dropdown">
        <button 
          className="dropdown-btn"
          onClick={() => setShowChemicals(!showChemicals)}
        >
          Chemicals {showChemicals ? '▲' : '▼'}
        </button>
        {showChemicals && (
          <div className="dropdown-content">
            {chemicalsList.map((item, index) => (
              <div key={index} className="material-item">
                <img src={item.imageSrc} alt={item.name} width="50" height="50" />
                <span>{item.name}</span>
                {/* Instead of directly adding chemicals, you might trigger a modal to select which apparatus to add to.
                    For now, we'll simply not include a direct "Add" button for chemicals. */}
                <button disabled>
                  Add Chemical
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
