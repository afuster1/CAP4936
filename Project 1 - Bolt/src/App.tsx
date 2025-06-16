import React, { useState, useEffect } from 'react';
import { Brain, Database, Calculator, Target } from 'lucide-react';
import NetworkVisualization from './components/NetworkVisualization';
import DataInputPanel from './components/DataInputPanel';
import CalculationSidebar from './components/CalculationSidebar';
import ResultsPanel from './components/ResultsPanel';
import { 
  WeatherData, 
  Neuron, 
  Connection, 
  PropagationStep, 
  FeatureImportance,
  NetworkWeights 
} from './types/neural-network';
import {
  createNetworkWeights,
  createNeuronPositions,
  createConnections,
  normalizeWeatherData,
  forwardPropagateWithSteps
} from './utils/neural-network';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 25,
    humidity: 60,
    windSpeed: 8,
    solarRadiation: 800
  });

  const [neurons, setNeurons] = useState<Neuron[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [weights] = useState<NetworkWeights>(createNetworkWeights());
  const [propagationSteps, setPropagationSteps] = useState<PropagationStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredConnection, setHoveredConnection] = useState<Connection | null>(null);
  const [selectedNeuron, setSelectedNeuron] = useState<Neuron | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Initialize network
  useEffect(() => {
    const initialNeurons = createNeuronPositions(800, 600);
    const initialConnections = createConnections(initialNeurons, weights);
    setNeurons(initialNeurons);
    setConnections(initialConnections);
  }, [weights]);

  const handleRunPropagation = async () => {
    setIsAnimating(true);
    setCurrentStep(0);
    setPrediction(null);
    setIsComplete(false);
    
    // Reset neurons
    const resetNeurons = neurons.map(n => ({
      ...n,
      activated: false,
      value: 0,
      weightedSum: 0
    }));
    setNeurons(resetNeurons);

    // Reset connections
    const resetConnections = connections.map(c => ({
      ...c,
      activated: false
    }));
    setConnections(resetConnections);

    // Normalize inputs and run propagation
    const normalizedInputs = normalizeWeatherData(weatherData);
    const { steps, finalOutput, neurons: updatedNeurons, featureImportance: importance } = 
      forwardPropagateWithSteps(normalizedInputs, weights);

    setPropagationSteps(steps);
    setFeatureImportance(importance);

    // Animate through steps
    for (let i = 1; i <= steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(i);
      
      // Update neurons based on current step
      const stepNeurons = updatedNeurons.map(neuron => {
        const shouldBeActive = steps.slice(0, i).some(step => 
          step.activeNeurons.includes(neuron.id)
        );
        return {
          ...neuron,
          activated: shouldBeActive
        };
      });
      setNeurons(stepNeurons);

      // Update connections
      const stepConnections = connections.map(conn => {
        const shouldBeActive = steps.slice(0, i).some(step => 
          step.activeConnections.includes(`${conn.from}-${conn.to}`)
        );
        return {
          ...conn,
          activated: shouldBeActive
        };
      });
      setConnections(stepConnections);
    }

    // Set final results
    setPrediction(finalOutput);
    setNeurons(updatedNeurons);
    setIsAnimating(false);
    setIsComplete(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setPrediction(null);
    setPropagationSteps([]);
    setFeatureImportance([]);
    setIsComplete(false);
    setSelectedNeuron(null);
    setHoveredConnection(null);
    
    // Reset neurons
    const resetNeurons = neurons.map(n => ({
      ...n,
      activated: false,
      value: 0,
      weightedSum: 0
    }));
    setNeurons(resetNeurons);

    // Reset connections
    const resetConnections = connections.map(c => ({
      ...c,
      activated: false
    }));
    setConnections(resetConnections);
  };

  const handleStepSelect = (step: number) => {
    if (!isAnimating) {
      setCurrentStep(step);
    }
  };

  const handleConnectionHover = (connection: Connection | null) => {
    setHoveredConnection(connection);
  };

  const handleNeuronClick = (neuron: Neuron) => {
    setSelectedNeuron(neuron);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Interactive Neural Network Visualizer</h1>
              <p className="text-gray-400 mt-1">
                Step-by-step forward propagation with renewable energy prediction (4-4-1 Architecture)
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Data Input Panel */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Database className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Input Configuration</h2>
            </div>
            <DataInputPanel
              weatherData={weatherData}
              onWeatherDataChange={setWeatherData}
              onRunPropagation={handleRunPropagation}
              onReset={handleReset}
              isAnimating={isAnimating}
            />
          </div>

          {/* Network Visualization */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Neural Network Visualization</h2>
            </div>
            <NetworkVisualization
              neurons={neurons}
              connections={connections}
              weights={weights}
              currentStep={currentStep}
              onConnectionHover={handleConnectionHover}
              onNeuronClick={handleNeuronClick}
            />
          </div>

          {/* Calculation Sidebar */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-semibold text-white">Calculations</h2>
            </div>
            <CalculationSidebar
              steps={propagationSteps}
              currentStep={currentStep}
              hoveredConnection={hoveredConnection}
              selectedNeuron={selectedNeuron}
              onStepSelect={handleStepSelect}
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="mt-8">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-white">Prediction Results & Analysis</h2>
          </div>
          <ResultsPanel
            prediction={prediction}
            featureImportance={featureImportance}
            isComplete={isComplete}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              Interactive neural network demonstrating forward propagation with step-by-step calculations
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>4 Input Neurons</span>
              <span>4 Hidden Neurons</span>
              <span>1 Output Neuron</span>
              <span>Current Step: {currentStep}/{propagationSteps.length}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;