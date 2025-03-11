import React, { useState } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import SimulationControls from './components/SimulationControls';
import ChemistryWorkspace from './components/ChemistryWorkspace';

function App() {
  const [experimentName] = useState("My Chemistry Experiment");
  const [currentStep] = useState({ number: 1, name: "Setup Lab" });
  const [simulationStatus, setSimulationStatus] = useState("stopped");
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Define apparatus list with type "apparatus"
  const apparatusList = [
    { id: 1, name: "Beaker", imageSrc: "https://m.media-amazon.com/images/I/61bEbTCHV5L._AC_UF1000,1000_QL80_.jpg", type: "apparatus" },
    { id: 2, name: "Flask", imageSrc: "https://www.sigmaaldrich.com/deepweb/assets/sigmaaldrich/product/images/207/642/d8e1bdca-bbcc-4545-a7ca-d30498020451/640/d8e1bdca-bbcc-4545-a7ca-d30498020451.jpg", type: "apparatus" },
    { id: 3, name: "Bunsen Burner", imageSrc: "https://helloartsy.com/wp-content/uploads/kids/school/how-to-draw-a-bunsen-burner/how-to-draw-a-bunsen-burner-step-4.jpg", type: "apparatus" }
  ];

  // addItemToWorkspace adds either apparatus or chemical.
  // Apparatus get numbered (e.g. "Beaker-1", "Beaker-2", ...)
  const addItemToWorkspace = (item) => {
    let newName = item.name;
    if (item.type === "apparatus") {
      const count = workspaceItems.filter(i => i.type === "apparatus" && i.name.startsWith(item.name + "-")).length + 1;
      newName = `${item.name}-${count}`;
    }
    const newItem = {
      id: Date.now(),
      name: newName,
      imageSrc: item.imageSrc,
      type: item.type,
      properties: {
        position: { x: 50, y: 50 },
        // For chemicals, store predefined color and details; for apparatus, leave empty.
        contents: item.type === "chemical" ? { chemical: item.name, amount: 1, color: item.color } : { chemical: "", amount: 0, color: "" }
      }
    };
    setWorkspaceItems([...workspaceItems, newItem]);
  };

  const removeItemFromWorkspace = (id) => {
    setWorkspaceItems(workspaceItems.filter(item => item.id !== id));
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
          removeItem={removeItemFromWorkspace}
        />
        <SideBar addItem={addItemToWorkspace} apparatusList={apparatusList} />
      </div>
      <SimulationControls 
         simulationStatus={simulationStatus}
         onPlay={handlePlay}
         onPause={handlePause}
         onStop={handleStop}
      />
    </div>
  );
}

export default App;
