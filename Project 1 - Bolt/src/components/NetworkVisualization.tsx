import React, { useState, useRef } from 'react';
import { Neuron, Connection, NetworkWeights } from '../types/neural-network';

interface NetworkVisualizationProps {
  neurons: Neuron[];
  connections: Connection[];
  weights: NetworkWeights;
  currentStep: number;
  onConnectionHover: (connection: Connection | null) => void;
  onNeuronClick: (neuron: Neuron) => void;
}

const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({
  neurons,
  connections,
  weights,
  currentStep,
  onConnectionHover,
  onNeuronClick
}) => {
  const [hoveredConnection, setHoveredConnection] = useState<Connection | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleConnectionMouseEnter = (connection: Connection) => {
    setHoveredConnection(connection);
    onConnectionHover(connection);
  };

  const handleConnectionMouseLeave = () => {
    setHoveredConnection(null);
    onConnectionHover(null);
  };

  const getConnectionColor = (connection: Connection) => {
    if (hoveredConnection?.from === connection.from && hoveredConnection?.to === connection.to) {
      return '#3B82F6';
    }
    if (connection.activated) {
      return connection.weight > 0 ? '#10B981' : '#EF4444';
    }
    return connection.weight > 0 ? '#10B98144' : '#EF444444';
  };

  const getConnectionWidth = (connection: Connection) => {
    if (hoveredConnection?.from === connection.from && hoveredConnection?.to === connection.to) {
      return 3;
    }
    return Math.abs(connection.weight) * 2 + 1;
  };

  const getNeuronColor = (neuron: Neuron) => {
    if (neuron.activated) {
      switch (neuron.layer) {
        case 'input':
          return '#3B82F6';
        case 'hidden':
          return '#8B5CF6';
        case 'output':
          return '#10B981';
        default:
          return '#6B7280';
      }
    }
    return '#374151';
  };

  const getNeuronStroke = (neuron: Neuron) => {
    if (neuron.activated) {
      return '#FFFFFF';
    }
    return '#6B7280';
  };

  const getFromNeuron = (connectionFrom: string) => {
    return neurons.find(n => n.id === connectionFrom);
  };

  const getToNeuron = (connectionTo: string) => {
    return neurons.find(n => n.id === connectionTo);
  };

  const layerLabels = ['Input Layer', 'Hidden Layer', 'Output Layer'];
  const inputLabels = ['Temperature', 'Humidity', 'Wind Speed', 'Solar Radiation'];

  return (
    <div className="bg-gray-900 rounded-lg p-6 h-full">
      <h2 className="text-xl font-semibold text-white mb-4">Neural Network Architecture (4-4-1)</h2>
      
      <svg
        ref={svgRef}
        width="100%"
        height="500"
        viewBox="0 0 800 500"
        className="bg-gray-800 rounded-lg"
      >
        {/* Layer labels */}
        <text x="100" y="30" fill="#D1D5DB" fontSize="14" fontWeight="bold" textAnchor="middle">
          Input Layer
        </text>
        <text x="400" y="30" fill="#D1D5DB" fontSize="14" fontWeight="bold" textAnchor="middle">
          Hidden Layer
        </text>
        <text x="700" y="30" fill="#D1D5DB" fontSize="14" fontWeight="bold" textAnchor="middle">
          Output Layer
        </text>

        {/* Connections */}
        {connections.map((connection, index) => {
          const fromNeuron = getFromNeuron(connection.from);
          const toNeuron = getToNeuron(connection.to);
          
          if (!fromNeuron || !toNeuron) return null;

          return (
            <g key={`connection-${index}`}>
              <line
                x1={fromNeuron.x}
                y1={fromNeuron.y}
                x2={toNeuron.x}
                y2={toNeuron.y}
                stroke={getConnectionColor(connection)}
                strokeWidth={getConnectionWidth(connection)}
                onMouseEnter={() => handleConnectionMouseEnter(connection)}
                onMouseLeave={handleConnectionMouseLeave}
                style={{ cursor: 'pointer' }}
              />
              
              {/* Weight label on hover */}
              {hoveredConnection?.from === connection.from && hoveredConnection?.to === connection.to && (
                <g>
                  <rect
                    x={(fromNeuron.x + toNeuron.x) / 2 - 20}
                    y={(fromNeuron.y + toNeuron.y) / 2 - 10}
                    width="40"
                    height="20"
                    fill="#1F2937"
                    stroke="#3B82F6"
                    strokeWidth="1"
                    rx="4"
                  />
                  <text
                    x={(fromNeuron.x + toNeuron.x) / 2}
                    y={(fromNeuron.y + toNeuron.y) / 2 + 4}
                    fill="#FFFFFF"
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {connection.weight.toFixed(2)}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Neurons */}
        {neurons.map((neuron, index) => (
          <g key={neuron.id}>
            <circle
              cx={neuron.x}
              cy={neuron.y}
              r="25"
              fill={getNeuronColor(neuron)}
              stroke={getNeuronStroke(neuron)}
              strokeWidth="2"
              onClick={() => onNeuronClick(neuron)}
              style={{ cursor: 'pointer' }}
              className="transition-all duration-300"
            />
            
            {/* Neuron value */}
            {neuron.value > 0 && (
              <text
                x={neuron.x}
                y={neuron.y + 4}
                fill="#FFFFFF"
                fontSize="12"
                textAnchor="middle"
                fontWeight="bold"
              >
                {neuron.value.toFixed(2)}
              </text>
            )}

            {/* Input labels */}
            {neuron.layer === 'input' && (
              <text
                x={neuron.x - 60}
                y={neuron.y + 4}
                fill="#D1D5DB"
                fontSize="12"
                textAnchor="middle"
              >
                {inputLabels[index]}
              </text>
            )}

            {/* Hidden neuron labels */}
            {neuron.layer === 'hidden' && (
              <text
                x={neuron.x}
                y={neuron.y + 45}
                fill="#D1D5DB"
                fontSize="10"
                textAnchor="middle"
              >
                H{index - 3}
              </text>
            )}

            {/* Output label */}
            {neuron.layer === 'output' && (
              <text
                x={neuron.x + 60}
                y={neuron.y + 4}
                fill="#D1D5DB"
                fontSize="12"
                textAnchor="middle"
              >
                Energy Output
              </text>
            )}
          </g>
        ))}

        {/* Animation indicators */}
        {currentStep > 0 && (
          <g>
            {/* Pulsing effect for active neurons */}
            {neurons.filter(n => n.activated).map(neuron => (
              <circle
                key={`pulse-${neuron.id}`}
                cx={neuron.x}
                cy={neuron.y}
                r="30"
                fill="none"
                stroke={getNeuronColor(neuron)}
                strokeWidth="2"
                opacity="0.5"
                className="animate-pulse"
              />
            ))}
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span className="text-gray-300">Input Neurons</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          <span className="text-gray-300">Hidden Neurons</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-gray-300">Output Neuron</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkVisualization;