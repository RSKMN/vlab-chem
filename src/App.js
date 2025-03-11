import React, { useState, useEffect } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import ChemistryWorkspace from './components/ChemistryWorkspace';
import ReactionDisplay from './components/ReactionDisplay';
import StepControls from './components/StepControls';
import experimentData from './data/myExperiment.json';

// A mapping for apparatus images (add more as needed)
const apparatusImages = {
  Beaker: "https://m.media-amazon.com/images/I/61bEbTCHV5L._AC_UF1000,1000_QL80_.jpg",
  Flask: "https://www.sigmaaldrich.com/deepweb/assets/sigmaaldrich/product/images/207/642/d8e1bdca-bbcc-4545-a7ca-d30498020451/640/d8e1bdca-bbcc-4545-a7ca-d30498020451.jpg"
};

function App() {
  const [experiment, setExperiment] = useState(null);
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [simulationStatus, setSimulationStatus] = useState("stopped");

  useEffect(() => {
    // Load the experiment JSON that was imported
    setExperiment(experimentData);
    setCurrentStepIndex(0);
    setWorkspaceItems([]);
    setHistory([]);
  }, []);

  // Applies a single step to the workspace
  const applyStep = (step) => {
    switch (step.action) {
      case "bringApparatus": {
        // Create a new apparatus item with a unique label
        const labelCount = step.countLabel || 1;
        const apparatusLabel = `${step.name}-${labelCount}`;
        const imageSrc = apparatusImages[step.name] || "https://via.placeholder.com/50";
        const newItem = {
          id: Date.now(),
          name: apparatusLabel,
          imageSrc,
          type: "apparatus",
          properties: {
            position: { x: 50, y: 50 },
            contents: { chemical: "", amount: 0, unit: "", color: "" }
          }
        };
        setWorkspaceItems(prev => [...prev, newItem]);
        break;
      }
      case "addChemical": {
        // Update the apparatus matching apparatusName with the chemical details
        setWorkspaceItems(prev =>
          prev.map((item) => {
            if (item.name === step.apparatusName) {
              return {
                ...item,
                properties: {
                  ...item.properties,
                  contents: {
                    chemical: step.chemical,
                    amount: step.amount,
                    unit: step.unit,
                    color: "#999"  // You could map chemical names to predefined colors
                  }
                }
              };
            }
            return item;
          })
        );
        break;
      }
      case "mix": {
        // For mix, you might add an animation or simply log it.
        console.log(`Mixing contents in ${step.apparatusName}`);
        break;
      }
      default:
        console.warn("Unknown action:", step.action);
    }
  };

  // Revert to a previous state from history
  const unapplyStep = (index) => {
    const prevState = history[index];
    if (prevState) {
      setWorkspaceItems(prevState);
    }
  };

  // Next step: store current state then apply next step.
  const handleNext = () => {
    if (!experiment || !experiment.steps) return;
    setHistory(prev => [...prev, workspaceItems]);
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < experiment.steps.length) {
      const step = experiment.steps[nextIndex];
      applyStep(step);
      setCurrentStepIndex(nextIndex);
    }
  };

  // Previous step: revert to the last state from history.
  const handlePrevious = () => {
    if (currentStepIndex <= 0) return;
    const prevIndex = currentStepIndex - 1;
    unapplyStep(prevIndex);
    setCurrentStepIndex(prevIndex);
    setHistory(prev => prev.slice(0, -1));
  };

  return (
    <div className="App">
      <TopBar experimentName={experiment ? experiment.experimentName : "No Experiment Loaded"} />
      {experiment && (
        <StepControls
          currentStepIndex={currentStepIndex}
          totalSteps={experiment.steps.length}
          onPrev={handlePrevious}
          onNext={handleNext}
        />
      )}
      <div className="main-container">
        <ReactionDisplay workspaceItems={workspaceItems} />
        <ChemistryWorkspace 
          items={workspaceItems}
          onSelectItem={() => {}}
          removeItem={() => {}}
        />
      </div>
      {/* Remove the previous play/pause/stop bar */}
    </div>
  );
}

export default App;
