import React from 'react';
import { TrendingUp, BarChart3, Target, Zap } from 'lucide-react';
import { FeatureImportance } from '../types/neural-network';

interface ResultsPanelProps {
  prediction: number | null;
  featureImportance: FeatureImportance[];
  isComplete: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  prediction,
  featureImportance,
  isComplete
}) => {
  const getPredictionLevel = (value: number) => {
    if (value >= 0.8) return { level: 'Very High', color: 'text-green-400', bg: 'bg-green-400' };
    if (value >= 0.6) return { level: 'High', color: 'text-blue-400', bg: 'bg-blue-400' };
    if (value >= 0.4) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400' };
    if (value >= 0.2) return { level: 'Low', color: 'text-orange-400', bg: 'bg-orange-400' };
    return { level: 'Very Low', color: 'text-red-400', bg: 'bg-red-400' };
  };

  const predictionLevel = prediction ? getPredictionLevel(prediction) : null;

  return (
    <div className="bg-gray-900 rounded-lg p-6 h-full">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="w-5 h-5 text-green-400" />
        <h2 className="text-xl font-semibold text-white">Prediction Results</h2>
      </div>

      {prediction !== null && isComplete ? (
        <div className="space-y-6">
          {/* Main Prediction Display */}
          <div className="bg-gradient-to-r from-green-900 to-blue-900 rounded-lg p-6 border border-green-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Energy Generation Probability</h3>
                  <p className="text-sm text-green-200">Neural network prediction output</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {(prediction * 100).toFixed(1)}%
                </div>
                <div className={`text-sm ${predictionLevel?.color}`}>
                  {predictionLevel?.level}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${prediction * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Feature Importance Analysis */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Feature Importance Analysis</h3>
            </div>
            
            <div className="space-y-4">
              {featureImportance.map((feature, index) => (
                <div key={feature.feature} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{feature.feature}</span>
                    <span className="text-white font-mono">{feature.importance.toFixed(1)}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                        index === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                        index === 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        index === 2 ? 'bg-gradient-to-r from-green-500 to-teal-500' :
                        'bg-gradient-to-r from-yellow-500 to-orange-500'
                      }`}
                      style={{ width: `${feature.importance}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Contribution: {feature.contribution.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Chart Visualization */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Feature Contribution Radar</h3>
            
            <svg width="100%" height="300" viewBox="0 0 300 300" className="mx-auto">
              {/* Radar grid */}
              <g transform="translate(150,150)">
                {/* Concentric circles */}
                {[20, 40, 60, 80, 100].map(radius => (
                  <circle
                    key={radius}
                    cx="0"
                    cy="0"
                    r={radius}
                    fill="none"
                    stroke="#374151"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Axis lines */}
                {featureImportance.map((_, index) => {
                  const angle = (index * 2 * Math.PI) / featureImportance.length - Math.PI / 2;
                  const x = Math.cos(angle) * 100;
                  const y = Math.sin(angle) * 100;
                  return (
                    <line
                      key={index}
                      x1="0"
                      y1="0"
                      x2={x}
                      y2={y}
                      stroke="#374151"
                      strokeWidth="1"
                    />
                  );
                })}
                
                {/* Data polygon */}
                <polygon
                  points={featureImportance.map((feature, index) => {
                    const angle = (index * 2 * Math.PI) / featureImportance.length - Math.PI / 2;
                    const radius = feature.importance;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="rgba(59, 130, 246, 0.3)"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
                
                {/* Data points */}
                {featureImportance.map((feature, index) => {
                  const angle = (index * 2 * Math.PI) / featureImportance.length - Math.PI / 2;
                  const radius = feature.importance;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#3B82F6"
                    />
                  );
                })}
                
                {/* Labels */}
                {featureImportance.map((feature, index) => {
                  const angle = (index * 2 * Math.PI) / featureImportance.length - Math.PI / 2;
                  const x = Math.cos(angle) * 120;
                  const y = Math.sin(angle) * 120;
                  return (
                    <text
                      key={index}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#D1D5DB"
                      fontSize="12"
                    >
                      {feature.feature.split(' ')[0]}
                    </text>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Prediction Explanation */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Prediction Explanation</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>
                The neural network analyzed the input weather conditions and determined a{' '}
                <span className={`font-bold ${predictionLevel?.color}`}>
                  {predictionLevel?.level.toLowerCase()}
                </span>{' '}
                probability ({(prediction * 100).toFixed(1)}%) for optimal renewable energy generation.
              </p>
              
              <p>
                <strong className="text-white">Key factors:</strong>
              </p>
              
              <ul className="list-disc list-inside space-y-1 ml-4">
                {featureImportance.slice(0, 2).map(feature => (
                  <li key={feature.feature}>
                    <strong>{feature.feature}</strong> had the highest impact ({feature.importance.toFixed(1)}% importance)
                  </li>
                ))}
              </ul>
              
              <p className="text-xs text-gray-400 mt-4">
                This prediction is based on a simplified neural network model for demonstration purposes.
                Real-world energy prediction systems use much more complex architectures and additional data sources.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-gray-600" />
          </div>
          <div className="text-center">
            <div className="text-white font-medium mb-2">No Prediction Available</div>
            <p className="text-gray-400 text-sm">
              Run forward propagation to see the neural network prediction and analysis
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;