import React from 'react';
import { Thermometer, Droplets, Wind, Sun, Play, RotateCcw } from 'lucide-react';
import { WeatherData, PresetScenario } from '../types/neural-network';
import { presetScenarios } from '../utils/neural-network';

interface DataInputPanelProps {
  weatherData: WeatherData;
  onWeatherDataChange: (data: WeatherData) => void;
  onRunPropagation: () => void;
  onReset: () => void;
  isAnimating: boolean;
}

const DataInputPanel: React.FC<DataInputPanelProps> = ({
  weatherData,
  onWeatherDataChange,
  onRunPropagation,
  onReset,
  isAnimating
}) => {
  const handleInputChange = (field: keyof WeatherData, value: number) => {
    onWeatherDataChange({
      ...weatherData,
      [field]: value
    });
  };

  const handlePresetSelect = (scenario: PresetScenario) => {
    onWeatherDataChange(scenario.data);
  };

  const inputConfigs = [
    {
      key: 'temperature' as keyof WeatherData,
      label: 'Temperature',
      icon: Thermometer,
      unit: '°C',
      min: -20,
      max: 40,
      step: 1,
      color: 'from-red-500 to-orange-500',
      description: 'Ambient air temperature'
    },
    {
      key: 'humidity' as keyof WeatherData,
      label: 'Humidity',
      icon: Droplets,
      unit: '%',
      min: 0,
      max: 100,
      step: 1,
      color: 'from-blue-500 to-cyan-500',
      description: 'Relative humidity percentage'
    },
    {
      key: 'windSpeed' as keyof WeatherData,
      label: 'Wind Speed',
      icon: Wind,
      unit: 'm/s',
      min: 0,
      max: 30,
      step: 0.5,
      color: 'from-green-500 to-teal-500',
      description: 'Wind velocity for turbines'
    },
    {
      key: 'solarRadiation' as keyof WeatherData,
      label: 'Solar Radiation',
      icon: Sun,
      unit: 'W/m²',
      min: 0,
      max: 1000,
      step: 10,
      color: 'from-yellow-500 to-amber-500',
      description: 'Solar irradiance intensity'
    }
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-6 h-full">
      <h2 className="text-xl font-semibold text-white mb-6">Input Data Configuration</h2>
      
      {/* Preset Scenarios */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Preset Scenarios</h3>
        <div className="grid grid-cols-1 gap-2">
          {presetScenarios.map((scenario, index) => (
            <button
              key={index}
              onClick={() => handlePresetSelect(scenario)}
              className="text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              disabled={isAnimating}
            >
              <div className="font-medium text-white text-sm">{scenario.name}</div>
              <div className="text-xs text-gray-400 mt-1">{scenario.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input Controls */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold text-gray-300">Manual Input</h3>
        
        {inputConfigs.map((config) => {
          const Icon = config.icon;
          const value = weatherData[config.key];
          const percentage = ((value - config.min) / (config.max - config.min)) * 100;
          
          return (
            <div key={config.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-white font-medium">{config.label}</label>
                    <p className="text-xs text-gray-500">{config.description}</p>
                  </div>
                </div>
                <span className="text-gray-300 font-mono text-lg">
                  {value} {config.unit}
                </span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={value}
                  onChange={(e) => handleInputChange(config.key, parseFloat(e.target.value))}
                  disabled={isAnimating}
                  className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div 
                  className={`absolute top-0 left-0 h-3 rounded-lg bg-gradient-to-r ${config.color} transition-all duration-300 pointer-events-none`}
                  style={{ width: `${percentage}%` }}
                />
                <div 
                  className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-300 pointer-events-none"
                  style={{ left: `calc(${percentage}% - 10px)` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>{config.min} {config.unit}</span>
                <span>{config.max} {config.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Buttons */}
      <div className="mt-8 space-y-3">
        <button
          onClick={onRunPropagation}
          disabled={isAnimating}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
            isAnimating
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
          }`}
        >
          <Play className="w-5 h-5" />
          <span>{isAnimating ? 'Processing...' : 'Run Forward Propagation'}</span>
        </button>

        <button
          onClick={onReset}
          disabled={isAnimating}
          className="w-full py-3 px-6 rounded-lg font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Network</span>
        </button>
      </div>

      {/* Current Values Summary */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Current Input Values</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Temperature:</span>
            <span className="text-white font-mono">{weatherData.temperature}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Humidity:</span>
            <span className="text-white font-mono">{weatherData.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Wind Speed:</span>
            <span className="text-white font-mono">{weatherData.windSpeed} m/s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Solar Radiation:</span>
            <span className="text-white font-mono">{weatherData.solarRadiation} W/m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInputPanel;