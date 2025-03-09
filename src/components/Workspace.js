import React from 'react';
import './Workspace.css';

const Workspace = ({ items, onSelectItem }) => {
  return (
    <div className="workspace">
      <h2>Workspace</h2>
      <div className="workspace-items">
        {items.map(item => (
          <div 
            key={item.id} 
            className="workspace-item" 
            onClick={() => onSelectItem(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workspace;

