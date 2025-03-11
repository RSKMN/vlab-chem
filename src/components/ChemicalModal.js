import React, { useState } from 'react';
import './ChemicalModal.css';

const ChemicalModal = ({ workspaceItems, chemical, onClose, onSubmit }) => {
  const [selectedApparatusId, setSelectedApparatusId] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedApparatusId && amount) {
      onSubmit(selectedApparatusId, amount);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="chemical-modal">
        <h3>Add {chemical.name}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Select Apparatus:
            <select
              value={selectedApparatusId}
              onChange={(e) => setSelectedApparatusId(e.target.value)}
            >
              <option value="">--Select--</option>
              {workspaceItems
                .filter(item => item.type === "apparatus")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
