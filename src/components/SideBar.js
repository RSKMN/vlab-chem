import React, { useState } from 'react';
import './SideBar.css';

const SideBar = ({ addItem, apparatusList }) => {
  const [showApparatus, setShowApparatus] = useState(false);
  const [showChemicals, setShowChemicals] = useState(false);

  // Chemicals list with predefined color and type "chemical"
  const chemicalsList = [
    { name: "Water", imageSrc: "https://media.istockphoto.com/id/2035384413/vector/h2o-icon-water-icon-vector.jpg?s=612x612&w=0&k=20&c=zlc43oTgVhZ6WRohUsrj_UTPWX1ox1oWEE03XTZ08QY=", type: "chemical", color: "#0000FF" },
    { name: "Ethanol", imageSrc: "https://assets.thermofisher.com/TFS-Assets/CCG/product-images/tf-80013631-ethanol-header-image.jpg-250.jpg", type: "chemical", color: "#FFA500" },
    { name: "Acetone", imageSrc: "https://study.com/cimages/multimages/16/webp.net-resizeimage24744141588368927425.png", type: "chemical", color: "#800080" }
  ];

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
                <button onClick={() => addItem(item)}>
                  Add to Workspace
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
