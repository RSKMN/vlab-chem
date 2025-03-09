import React from 'react';
import './PropertiesPanel.css';

const PropertiesPanel = ({ selectedItem }) => {
  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      {selectedItem ? (
        <div>
          <p><strong>Name:</strong> {selectedItem.name}</p>
          <p>
            <strong>Position:</strong> {`x: ${selectedItem.properties.position.x}, y: ${selectedItem.properties.position.y}`}
          </p>
        </div>
      ) : (
        <p>Select an item to see its properties.</p>
      )}
    </div>
  );
};

export default PropertiesPanel;

