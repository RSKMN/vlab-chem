import React, { useState, useEffect } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import ChemistryWorkspace from './components/ChemistryWorkspace';
import ReactionDisplay from './components/ReactionDisplay';
import StepControls from './components/StepControls';
import experimentData from './data/myExperiment.json';

// Mapping apparatus names to images
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
    // Load the experiment JSON on mount
    setExperiment(experimentData);
    setCurrentStepIndex(0);
    setWorkspaceItems([]);
    setHistory([]);
  }, []);

  // Apply one step to the workspace
  const applyStep = (step) => {
    switch (step.action) {
      case "bringApparatus": {
        // Construct a unique label: e.g., "Beaker-1"
        // Here, step.countLabel is provided in the JSON for simplicity.
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
        setWorkspaceItems((prev) => [...prev, newItem]);
        break;
      }
      case "addChemical": {
        // Update the apparatus matching step.apparatusName with chemical details
        setWorkspaceItems((prev) =>
          prev.map((item) =>
            item.name === step.apparatusName
              ? {
                  ...item,
                  properties: {
                    ...item.properties,
                    contents: {
                      chemical: step.chemical,
                      amount: step.amount,
                      unit: step.unit,
                      color: "#999" // Default color for chemical
                    }
                  }
                }
              : item
          )
        );
        break;
      }
      case "mix": {
        console.log(`Mixing contents in ${step.apparatusName}`);
        // Additional mix logic or animations can be added here
        break;
      }
      default:
        console.warn("Unknown action:", step.action);
    }
  };

  // To revert steps, we store the entire workspace state in history.
  const unapplyStep = (index) => {
    const prevState = history[index];
    if (prevState) {
      setWorkspaceItems(prevState);
    }
  };

  // Handle Next: apply the step at the current index, then increment.
  const handleNext = () => {
    if (!experiment || !experiment.steps) return;
    if (currentStepIndex >= experiment.steps.length) return;
    // Save current workspace state in history
    setHistory((prev) => [...prev, workspaceItems]);
    const step = experiment.steps[currentStepIndex];
    applyStep(step);
    setCurrentStepIndex((prev) => prev + 1);
  };

  // Handle Previous: revert to the previous workspace state.
  const handlePrevious = () => {
    if (currentStepIndex <= 0) return;
    const prevIndex = currentStepIndex - 1;
    unapplyStep(prevIndex);
    setCurrentStepIndex(prevIndex);
    setHistory((prev) => prev.slice(0, -1));
  };

  return (
    <div className="App">
      <TopBar experimentName={experiment ? experiment.experimentName : "No Experiment Loaded"} currentStep={experiment ? experiment.steps[currentStepIndex - 1] : { number: 0, name: "N/A" }} />
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
    </div>
  );
}

export default App;
