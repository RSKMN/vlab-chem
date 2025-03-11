import React, { useState, useEffect } from 'react';
import './ChemistryWorkspace.css';

const ChemistryWorkspace = ({ items, onSelectItem, removeItem }) => {
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
      item: item,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClick = () => {
      if (contextMenu) closeContextMenu();
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [contextMenu]);

  return (
    <div className="chem-workspace">
      <div className="workspace-header">
        <h2>Chemistry Lab Workspace (Simulation Mode)</h2>
        <p>Right-click an apparatus for details.</p>
      </div>
      <div className="lab-bench">
        <div className="lab-items">
          {items.map((item) => (
            <div
              key={item.id}
              className="lab-item"
              onClick={() => onSelectItem(item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              <img src={item.imageSrc} alt={item.name} width="50" height="50" />
              <div className="item-label">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
      {contextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
        >
          <div>
            <strong>{contextMenu.item.name}</strong>
          </div>
          {contextMenu.item.properties.contents.chemical ? (
            <>
              <div>
                Chemical: {contextMenu.item.properties.contents.chemical}
              </div>
              <div>
                Amount: {contextMenu.item.properties.contents.amount}
                {contextMenu.item.properties.contents.unit}
              </div>
            </>
          ) : (
            <div>No chemical contents.</div>
          )}
          <button
            onClick={() => {
              removeItem(contextMenu.item.id);
              closeContextMenu();
            }}
          >
            Remove from Workspace
          </button>
        </div>
      )}
    </div>
  );
};

export default ChemistryWorkspace;
