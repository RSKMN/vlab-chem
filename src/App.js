import React, { useState } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import SimulationControls from './components/SimulationControls';
import PropertiesPanel from './components/PropertiesPanel';
import ChemistryWorkspace from './components/ChemistryWorkspace';

function App() {
  const [experimentName] = useState("My Chemistry Experiment");
  const [currentStep] = useState({ number: 1, name: "Setup Lab" });
  const [simulationStatus, setSimulationStatus] = useState("stopped");
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Apparatus list with dropdown functionality
  const apparatusList = [
    { id: 1, name: "Beaker" },
    { id: 2, name: "Flask" },
    { id: 3, name: "Test Tube" }
  ];

  const addItemToWorkspace = (item) => {
    const newItem = {
      id: Date.now(),
      name: item.name,
      // ADD imageSrc so the workspace can display the actual image
      imageSrc: item.imageSrc,
      properties: {
        position: { x: 50, y: 50 } // Default position
      }
    };
    setWorkspaceItems([...workspaceItems, newItem]);
  };

  const selectItem = (item) => {
    setSelectedItem(item);
  };

  const handlePlay = () => setSimulationStatus("playing");
  const handlePause = () => setSimulationStatus("paused");
  const handleStop = () => setSimulationStatus("stopped");

  return (
    <div className="App">
      <TopBar experimentName={experimentName} currentStep={currentStep} />
      <div className="main-container">
        <ChemistryWorkspace 
          items={workspaceItems} 
          onSelectItem={selectItem} 
          apparatusList={apparatusList} 
          onAddToWorkspace={addItemToWorkspace} 
        />
        <SideBar addItem={addItemToWorkspace} />
      </div>
      <SimulationControls 
         simulationStatus={simulationStatus}
         onPlay={handlePlay}
         onPause={handlePause}
         onStop={handleStop}
      />
      <PropertiesPanel selectedItem={selectedItem} />
    </div>
  );
}

export default App;
