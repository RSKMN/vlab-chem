import React from 'react';
import './SideBar.css';

const SideBar = ({ addItem }) => {
  return (
    <div className="side-bar">
      <h3>Apparatus &amp; Tools</h3>
      <ul>
        <li onClick={() => addItem("Tool 1")}>Tool 1</li>
        <li onClick={() => addItem("Tool 2")}>Tool 2</li>
        <li onClick={() => addItem("Tool 3")}>Tool 3</li>
      </ul>
      <div className="dropdown">
        <button className="dropdown-btn">More Options</button>
        <div className="dropdown-content">
          <a href="#">Option 1</a>
          <a href="#">Option 2</a>
          <a href="#">Option 3</a>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

