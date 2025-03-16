import React from 'react';
import './ChemistryWorkspace.css';

// Define known apparatus & chemicals
const KNOWN_APPARATUS = {
  Beaker: {
    name: "Beaker",
    imageSrc: "/images/beaker.png",
    color: "#888"
  },
  Flask: {
    name: "Flask",
    imageSrc: "/images/flask.png",
    color: "#bbb"
  }
};

const KNOWN_CHEMICALS = {
  HCl: {
    name: "HCl",
    color: "#ff0000"
  },
  NaOH: {
    name: "NaOH",
    color: "#00ff00"
  },
  Water: {
    name: "Water",
    color: "#0000ff"
  }
};

const ChemistryWorkspace = ({ items, onSelectItem, removeItem }) => {
  // Create merged items without altering your UI code
  const mergedItems = items.map((item) => {
    // Determine the user-provided name (check item.name, then properties.name)
    const userName = item.name || (item.properties && item.properties.name) || "Unknown Apparatus";
    
    // Start with the original item and ensure name is set
    let mergedItem = { ...item, name: userName };

    // If a known apparatus exists for this name (exact match), merge its data
    if (KNOWN_APPARATUS[userName]) {
      mergedItem = {
        ...mergedItem,
        name: KNOWN_APPARATUS[userName].name, // override with known name
        imageSrc: KNOWN_APPARATUS[userName].imageSrc,
        properties: {
          ...mergedItem.properties,
          color: KNOWN_APPARATUS[userName].color
        }
      };
    } else {
      // Otherwise, ensure defaults so we don't get undefined
      mergedItem.imageSrc = mergedItem.imageSrc || "/images/placeholder.png";
      mergedItem.properties = {
        ...mergedItem.properties,
        color: (mergedItem.properties && mergedItem.properties.color) || "#aaa"
      };
    }

    // Process chemicals if any are present
    if (mergedItem.chemicals && Array.isArray(mergedItem.chemicals)) {
      mergedItem.chemicals = mergedItem.chemicals.map((chem) => {
        const userChemName = chem.name || chem.id || "Unknown Chemical";
        let mergedChem = { ...chem, name: userChemName };
        if (KNOWN_CHEMICALS[userChemName]) {
          mergedChem = {
            ...mergedChem,
            name: KNOWN_CHEMICALS[userChemName].name,
            color: KNOWN_CHEMICALS[userChemName].color
          };
        } else {
          // Ensure the name is retained if not found in known chemicals
          mergedChem.color = mergedChem.color || "#ccc";
        }
        return mergedChem;
      });
    }
    return mergedItem;
  });

  // Render your UI exactly as provided (unchanged)
  return (
    <div className="chem-workspace">
      <div className="workspace-header">
        <h2>Chemistry Lab Workspace (Simulation Mode)</h2>
        <p>Use Previous/Next to step through the experiment.</p>
      </div>
      <div className="lab-bench">
        <div className="lab-items">
          {mergedItems.map((item) => {
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
                      {item.chemicals.map((chem) => (
                        <li key={chem.id || chem.name}>
                          <span className="chem-icon">⚗️</span>
                          <strong>{chem.name}</strong>
                          &nbsp;({chem.amount !== undefined ? chem.amount : 'N/A'} {chem.unit || ""})
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