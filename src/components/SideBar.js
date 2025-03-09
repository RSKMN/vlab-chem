import React, { useState } from 'react';
import './SideBar.css';

const SideBar = ({ addItem }) => {
  const [showApparatus, setShowApparatus] = useState(false);
  const [showChemicals, setShowChemicals] = useState(false);

  // Static lists for apparatus and chemicals.
  const apparatusList = [
    { name: "Beaker", imageSrc: "https://m.media-amazon.com/images/I/61bEbTCHV5L._AC_UF1000,1000_QL80_.jpg" },
    { name: "Flask", imageSrc: "https://www.sigmaaldrich.com/deepweb/assets/sigmaaldrich/product/images/207/642/d8e1bdca-bbcc-4545-a7ca-d30498020451/640/d8e1bdca-bbcc-4545-a7ca-d30498020451.jpg" },
    { name: "Bunsen Burner", imageSrc: "https://helloartsy.com/wp-content/uploads/kids/school/how-to-draw-a-bunsen-burner/how-to-draw-a-bunsen-burner-step-4.jpg" }
  ];

  const chemicalsList = [
    { name: "Water", imageSrc: "https://media.istockphoto.com/id/2035384413/vector/h2o-icon-water-icon-vector.jpg?s=612x612&w=0&k=20&c=zlc43oTgVhZ6WRohUsrj_UTPWX1ox1oWEE03XTZ08QY=" },
    { name: "Ethanol", imageSrc: "https://assets.thermofisher.com/TFS-Assets/CCG/product-images/tf-80013631-ethanol-header-image.jpg-250.jpg" },
    { name: "Acetone", imageSrc: "https://study.com/cimages/multimages/16/webp.net-resizeimage24744141588368927425.png" }
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
                {/* You can add an "Add to Workspace" button for chemicals if desired */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
