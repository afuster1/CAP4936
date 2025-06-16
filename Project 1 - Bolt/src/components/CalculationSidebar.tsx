import React from 'react';
import { Calculator, Brain, TrendingUp } from 'lucide-react';
import { PropagationStep, Connection, Neuron } from '../types/neural-network';

interface CalculationSidebarProps {
  steps: PropagationStep[];
  currentStep: number;
  hoveredConnection: Connection | null;
  selectedNeuron: Neuron | null;
  onStepSelect: (step: number) => void;
}

const CalculationSidebar: React.FC<CalculationSidebarProps> = ({
  steps,
  currentStep,
  hoveredConnection,
  selectedNeuron,
  onStepSelect
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6 h-full overflow-y-auto">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Calculation Steps</h2>
      </div>

      {/* Connection Weight Display */}
      {hoveredConnection && (
        <div className="mb-6 p-4 bg-blue-900 bg-opacity-50 rounded-lg border border-blue-700">
          <h3 className="text-sm font-semibold text-blue-300 mb-2">Connection Weight</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">From:</span>
              <span className="text-white font-mono">{hoveredConnection.from}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">To:</span>
              <span className="text-white font-mono">{hoveredConnection.to}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Weight:</span>
              <span className={`font-mono font-bold ${
                hoveredConnection.weight > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {hoveredConnection.weight.toFixed(4)}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {hoveredConnection.weight > 0 
                ? 'Positive weight: Excitatory connection' 
                : 'Negative weight: Inhibitory connection'
              }
            </div>
          </div>
        </div>
      )}

      {/* Selected Neuron Details */}
      {selectedNeuron && (
        <div className="mb-6 p-4 bg-purple-900 bg-opacity-50 rounded-lg border border-purple-700">
          <h3 className="text-sm font-semibold text-purple-300 mb-2">Neuron Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">ID:</span>
              <span className="text-white font-mono">{selectedNeuron.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Layer:</span>
              <span className="text-white capitalize">{selectedNeuron.layer}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Value:</span>
              <span className="text-white font-mono">{selectedNeuron.value.toFixed(4)}</span>
            </div>
            {selectedNeuron.weightedSum !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Weighted Sum:</span>
                <span className="text-white font-mono">{selectedNeuron.weightedSum.toFixed(4)}</span>
              </div>
            )}
            {selectedNeuron.bias !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Bias:</span>
                <span className="text-white font-mono">{selectedNeuron.bias.toFixed(4)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Propagation Steps */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-300">Forward Propagation Steps</h3>
        
        {steps.map((step, index) => (
          <div
            key={step.step}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              currentStep === step.step
                ? 'bg-green-900 bg-opacity-50 border-green-600'
                : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
            }`}
            onClick={() => onStepSelect(step.step)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === step.step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {step.step}
                </div>
                <span className="text-white font-medium">Step {step.step}</span>
              </div>
              {currentStep === step.step && (
                <TrendingUp className="w-4 h-4 text-green-400" />
              )}
            </div>
            
            <p className="text-sm text-gray-300 mb-3">{step.description}</p>
            
            {step.calculations.length > 0 && (
              <div className="space-y-3">
                {step.calculations.map((calc, calcIndex) => (
                  <div key={calcIndex} className="bg-gray-800 p-3 rounded border-l-4 border-blue-500">
                    <div className="text-xs text-gray-400 mb-1">
                      Neuron: {calc.neuronId}
                    </div>
                    
                    {/* Input contributions */}
                    <div className="space-y-1 mb-2">
                      {calc.inputs.map((input, inputIndex) => (
                        <div key={inputIndex} className="text-xs text-gray-300 font-mono">
                          {input.value.toFixed(3)} × {input.weight.toFixed(3)} = {(input.value * input.weight).toFixed(3)}
                        </div>
                      ))}
                    </div>
                    
                    {/* Weighted sum calculation */}
                    <div className="text-xs text-gray-300 font-mono mb-1">
                      Sum = {calc.weightedSum.toFixed(3)} + {calc.bias.toFixed(3)} (bias)
                    </div>
                    
                    {/* Final formula */}
                    <div className="text-xs text-blue-300 font-mono font-bold">
                      {calc.formula}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mathematical Explanation */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Activation Function</h3>
        <div className="text-xs text-gray-400 space-y-2">
          <div>
            <strong className="text-white">Sigmoid Function:</strong>
          </div>
          <div className="font-mono bg-gray-900 p-2 rounded">
            σ(x) = 1 / (1 + e^(-x))
          </div>
          <div>
            Maps any real number to a value between 0 and 1, making it suitable for probability-like outputs.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationSidebar;