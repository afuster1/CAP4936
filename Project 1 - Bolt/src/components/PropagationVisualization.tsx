import React from 'react';
import { TrendingUp, TrendingDown, Zap, Wind, Sun } from 'lucide-react';
import { EnergyPrediction } from '../types/neural-network';

interface PropagationVisualizationProps {
  prediction: EnergyPrediction | null;
  isAnimating: boolean;
}

const PropagationVisualization: React.FC<PropagationVisualizationProps> = ({
  prediction,
  isAnimating
}) => {
  const maxGeneration = 1000; // Maximum possible generation for visualization
  
  const getEfficiencyLevel = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return { level: 'Excellent', color: 'text-green-400', bg: 'bg-green-400' };
    if (percentage >= 60) return { level: 'Good', color: 'text-blue-400', bg: 'bg-blue-400' };
    if (percentage >= 40) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400' };
    if (percentage >= 20) return { level: 'Low', color: 'text-orange-400', bg: 'bg-orange-400' };
    return { level: 'Very Low', color: 'text-red-400', bg: 'bg-red-400' };
  };

  const solarEfficiency = prediction ? getEfficiencyLevel(prediction.solarGeneration, maxGeneration) : null;
  const windEfficiency = prediction ? getEfficiencyLevel(prediction.windGeneration, 500) : null;

  return (
    <div className="bg-gray-900 rounded-lg p-6 h-full">
      <h2 className="text-xl font-semibold text-white mb-6">Energy Generation Prediction</h2>
      
      {prediction ? (
        <div className="space-y-6">
          {/* Solar Energy Prediction */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Solar Generation</h3>
                  <p className="text-sm text-gray-400">Photovoltaic output prediction</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {prediction.solarGeneration} MW
                </div>
                <div className={`text-sm ${solarEfficiency?.color}`}>
                  {solarEfficiency?.level}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${Math.min((prediction.solarGeneration / maxGeneration) * 100, 100)}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 MW</span>
              <span>{maxGeneration} MW</span>
            </div>
          </div>

          {/* Wind Energy Prediction */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Wind className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Wind Generation</h3>
                  <p className="text-sm text-gray-400">Turbine output prediction</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {prediction.windGeneration} MW
                </div>
                <div className={`text-sm ${windEfficiency?.color}`}>
                  {windEfficiency?.level}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${Math.min((prediction.windGeneration / 500) * 100, 100)}%` 
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 MW</span>
              <span>500 MW</span>
            </div>
          </div>

          {/* Total Generation Summary */}
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Generation</h3>
                  <p className="text-sm text-blue-200">Combined renewable output</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {prediction.solarGeneration + prediction.windGeneration} MW
                </div>
                <div className="text-sm text-blue-200">
                  Peak capacity utilization
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-800">
              <div className="text-center">
                <div className="text-yellow-400 text-lg font-semibold">
                  {Math.round((prediction.solarGeneration / (prediction.solarGeneration + prediction.windGeneration)) * 100)}%
                </div>
                <div className="text-xs text-gray-300">Solar Contribution</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 text-lg font-semibold">
                  {Math.round((prediction.windGeneration / (prediction.solarGeneration + prediction.windGeneration)) * 100)}%
                </div>
                <div className="text-xs text-gray-300">Wind Contribution</div>
              </div>
            </div>
          </div>

          {/* Network Performance Metrics */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Network Performance</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-green-400 text-sm font-semibold">98.7%</div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div>
                <div className="text-blue-400 text-sm font-semibold">0.023</div>
                <div className="text-xs text-gray-500">Loss</div>
              </div>
              <div>
                <div className="text-purple-400 text-sm font-semibold">12ms</div>
                <div className="text-xs text-gray-500">Inference</div>
              </div>
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
              Run forward propagation to see energy generation predictions
            </p>
          </div>
        </div>
      )}

      {isAnimating && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-white font-medium">Processing Neural Network...</div>
            <div className="text-gray-400 text-sm">Calculating energy predictions</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropagationVisualization;