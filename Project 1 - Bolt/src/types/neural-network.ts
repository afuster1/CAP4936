export interface Neuron {
  id: string;
  value: number;
  x: number;
  y: number;
  layer: 'input' | 'hidden' | 'output';
  activated: boolean;
  bias?: number;
  weightedSum?: number;
}

export interface Connection {
  from: string;
  to: string;
  weight: number;
  activated: boolean;
  value?: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  solarRadiation: number;
}

export interface NetworkWeights {
  inputToHidden: number[][];
  hiddenToOutput: number[];
  hiddenBias: number[];
  outputBias: number;
}

export interface PropagationStep {
  step: number;
  description: string;
  activeNeurons: string[];
  activeConnections: string[];
  calculations: CalculationStep[];
}

export interface CalculationStep {
  neuronId: string;
  inputs: { from: string; value: number; weight: number }[];
  weightedSum: number;
  bias: number;
  output: number;
  formula: string;
}

export interface PresetScenario {
  name: string;
  description: string;
  data: WeatherData;
  expectedOutcome: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  contribution: number;
}