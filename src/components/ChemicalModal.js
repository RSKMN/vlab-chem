import React, { useState } from 'react';
import './ChemicalModal.css';

const ChemicalModal = ({ workspaceItems, onClose, onAddChemical }) => {
  const [selectedApparatusId, setSelectedApparatusId] = useState("");
  const [chemical, setChemical] = useState("");
  const [amount, setAmount] = useState("");
  const [color, setColor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedApparatusId && chemical) {
      onAddChemical(parseInt(selectedApparatusId), chemical, amount, color);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="chemical-modal">
        <h3>Add Chemical to Apparatus</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Select Apparatus:
            <select
              value={selectedApparatusId}
              onChange={(e) => setSelectedApparatusId(e.target.value)}
            >
              <option value="">--Select--</option>
              {workspaceItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Chemical:
            <input
              type="text"
              value={chemical}
              onChange={(e) => setChemical(e.target.value)}
            />
          </label>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label>
            Color:
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </label>
          <div className="modal-buttons">
            <button type="submit">Add Chemical</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChemicalModal;
