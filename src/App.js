import React, { useState, useEffect } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import ChemistryWorkspace from './components/ChemistryWorkspace';
import ReactionDisplay from './components/ReactionDisplay';
import StepControls from './components/StepControls';
import experimentsData from './data/experiments.json';

// Mapping for apparatus images
const apparatusImages = {
  "Beaker": "https://m.media-amazon.com/images/I/61bEbTCHV5L._AC_UF1000,1000_QL80_.jpg",
  "Flask": "https://www.sigmaaldrich.com/deepweb/assets/sigmaaldrich/product/images/207/642/d8e1bdca-bbcc-4545-a7ca-d30498020451/640/d8e1bdca-bbcc-4545-a7ca-d30498020451.jpg",
  "Bunsen Burner": "https://d2cbg94ubxgsnp.cloudfront.net/Pictures/280xAny/7/9/8/127798_classic-kit-200_tcm18-99904.jpg"
};

function App() {
  const [experiment, setExperiment] = useState(null);
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedExperimentId, setSelectedExperimentId] = useState("");

  useEffect(() => {
    // Reset state on mount
    setWorkspaceItems([]);
    setCurrentStepIndex(0);
    setHistory([]);
  }, []);

  // Handle experiment selection from dropdown
  const handleExperimentSelection = (e) => {
    const expId = e.target.value;
    setSelectedExperimentId(expId);
    const selectedExp = experimentsData.experiments.find(exp => exp.experimentId === expId);
    setExperiment(selectedExp);
    setWorkspaceItems([]);
    setCurrentStepIndex(0);
    setHistory([]);
  };

  // Apply a single step to the workspace
  const applyStep = (step) => {
    switch (step.action) {
      case "bringApparatus": {
        // e.g. { appliance: "Beaker", countLabel: 1, color: "#888" }
        const labelCount = step.countLabel || 1;
        const apparatusType = step.appliance;  // "Beaker", "Flask", etc.
        const apparatusLabel = `${apparatusType}-${labelCount}`; // e.g. "Beaker-1"
        
        // Dictionary lookup for images
        const imageSrc = apparatusImages[apparatusType] || "https://via.placeholder.com/50";

        const newItem = {
          id: Date.now(),
          name: apparatusLabel,        // final label in workspace
          imageSrc,
          type: "apparatus",
          chemicals: [],
          properties: {
            position: { x: 50, y: 50 },
            color: step.color || "#aaa"
          }
        };
        setWorkspaceItems(prev => [...prev, newItem]);
        break;
      }

      case "addChemical": {
        // e.g. { apparatusName: "Beaker-1", chemical: "HCl", amount: 50, unit: "ml" }
        setWorkspaceItems(prev =>
          prev.map(item => {
            if (item.name === step.apparatusName) {
              const newChem = {
                name: step.chemical,
                amount: step.amount,
                unit: step.unit,
                color: step.color || "#999"
              };
              return {
                ...item,
                chemicals: [...item.chemicals, newChem]
              };
            }
            return item;
          })
        );
        break;
      }

      case "mix": {
        // e.g. { apparatusName: "Beaker-1", color: "#0000ff" }
        console.log(`Mixing contents in ${step.apparatusName}`);
        setWorkspaceItems(prev =>
          prev.map(item => {
            if (item.name === step.apparatusName) {
              // Example: replace chemicals with reaction products
              return {
                ...item,
                chemicals: [
                  { name: "NaCl", amount: 100, unit: "ml", color: "#ccc" },
                  { name: "H2O", amount: 100, unit: "ml", color: "#9cf" }
                ],
                properties: {
                  ...item.properties,
                  color: step.color || "#0000ff"
                }
              };
            }
            return item;
          })
        );
        break;
      }

      default:
        console.warn("Unknown action:", step.action);
    }
  };

  // Revert to previous workspace state
  const unapplyStep = (index) => {
    const prevState = history[index];
    if (prevState) {
      setWorkspaceItems(prevState);
    }
  };

  // Next step: store current state, apply next step, then increment index
  const handleNext = () => {
    if (!experiment || !experiment.steps) return;
    if (currentStepIndex >= experiment.steps.length) return;
    setHistory(prev => [...prev, workspaceItems]);
    const step = experiment.steps[currentStepIndex];
    applyStep(step);
    setCurrentStepIndex(prev => prev + 1);
  };

  // Previous step: revert to previous state
  const handlePrevious = () => {
    if (currentStepIndex <= 0) return;
    const prevIndex = currentStepIndex - 1;
    unapplyStep(prevIndex);
    setCurrentStepIndex(prevIndex);
    setHistory(prev => prev.slice(0, -1));
  };

  const safeStep = experiment?.steps?.[currentStepIndex - 1] || { number: 0, name: "N/A" };

  return (
    <div className="App">
      <TopBar 
        experimentName={experiment ? experiment.experimentName : "No Experiment Loaded"}
        currentStep={safeStep}
      />

      {/* Experiment selection dropdown */}
      <div className="experiment-selector">
        <label htmlFor="experiment-select">Choose an Experiment: </label>
        <select
          id="experiment-select"
          value={selectedExperimentId}
          onChange={handleExperimentSelection}
        >
          <option value="">--Select--</option>
          {experimentsData.experiments.map(exp => (
            <option key={exp.experimentId} value={exp.experimentId}>
              {exp.experimentName}
            </option>
          ))}
        </select>
      </div>

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
