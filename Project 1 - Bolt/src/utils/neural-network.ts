import { Neuron, Connection, WeatherData, NetworkWeights, PropagationStep, CalculationStep, PresetScenario, FeatureImportance } from '../types/neural-network';

// Sigmoid activation function
export const sigmoid = (x: number): number => {
  return 1 / (1 + Math.exp(-x));
};

// ReLU activation function
export const relu = (x: number): number => {
  return Math.max(0, x);
};

// Initialize network weights
export const createNetworkWeights = (): NetworkWeights => {
  return {
    inputToHidden: [
      [0.8, -0.5, 0.3, 0.7],
      [0.4, 0.9, -0.3, 0.2],
      [-0.6, 0.7, 0.5, -0.8],
      [0.2, -0.4, 0.8, 0.6]
    ],
    hiddenToOutput: [0.7, -0.3, 0.4, 0.9],
    hiddenBias: [0.1, -0.2, 0.3, -0.1],
    outputBias: 0.2
  };
};

// Normalize weather input data
export const normalizeWeatherData = (data: WeatherData): number[] => {
  return [
    (data.temperature + 20) / 60, // Normalize temperature (-20 to 40°C)
    data.humidity / 100,          // Humidity is already 0-100%
    data.windSpeed / 30,          // Normalize wind speed (0-30 m/s)
    data.solarRadiation / 1000    // Normalize solar radiation (0-1000 W/m²)
  ];
};

// Create neuron positions for SVG
export const createNeuronPositions = (width: number, height: number): Neuron[] => {
  const neurons: Neuron[] = [];
  const layerSpacing = width / 4;
  const startX = layerSpacing / 2;

  // Input layer (4 neurons)
  const inputLabels = ['temp', 'humidity', 'wind', 'solar'];
  for (let i = 0; i < 4; i++) {
    neurons.push({
      id: `input-${i}`,
      value: 0,
      x: startX,
      y: height * (0.15 + i * 0.2),
      layer: 'input',
      activated: false
    });
  }

  // Hidden layer (4 neurons)
  for (let i = 0; i < 4; i++) {
    neurons.push({
      id: `hidden-${i}`,
      value: 0,
      x: startX + layerSpacing * 1.5,
      y: height * (0.15 + i * 0.2),
      layer: 'hidden',
      activated: false,
      bias: 0,
      weightedSum: 0
    });
  }

  // Output layer (1 neuron)
  neurons.push({
    id: 'output-0',
    value: 0,
    x: startX + layerSpacing * 3,
    y: height * 0.5,
    layer: 'output',
    activated: false,
    bias: 0,
    weightedSum: 0
  });

  return neurons;
};

// Create connections between neurons
export const createConnections = (neurons: Neuron[], weights: NetworkWeights): Connection[] => {
  const connections: Connection[] = [];

  // Input to hidden connections
  const inputNeurons = neurons.filter(n => n.layer === 'input');
  const hiddenNeurons = neurons.filter(n => n.layer === 'hidden');
  const outputNeurons = neurons.filter(n => n.layer === 'output');

  inputNeurons.forEach((inputNeuron, i) => {
    hiddenNeurons.forEach((hiddenNeuron, j) => {
      connections.push({
        from: inputNeuron.id,
        to: hiddenNeuron.id,
        weight: weights.inputToHidden[i][j],
        activated: false
      });
    });
  });

  // Hidden to output connections
  hiddenNeurons.forEach((hiddenNeuron, i) => {
    outputNeurons.forEach((outputNeuron) => {
      connections.push({
        from: hiddenNeuron.id,
        to: outputNeuron.id,
        weight: weights.hiddenToOutput[i],
        activated: false
      });
    });
  });

  return connections;
};

// Forward propagation with step-by-step calculation
export const forwardPropagateWithSteps = (
  inputs: number[],
  weights: NetworkWeights
): { steps: PropagationStep[]; finalOutput: number; neurons: Neuron[]; featureImportance: FeatureImportance[] } => {
  const steps: PropagationStep[] = [];
  const neurons = createNeuronPositions(800, 600);
  
  // Step 1: Set input values
  inputs.forEach((value, i) => {
    neurons[i].value = value;
    neurons[i].activated = true;
  });

  steps.push({
    step: 1,
    description: "Input values are set and normalized",
    activeNeurons: neurons.slice(0, 4).map(n => n.id),
    activeConnections: [],
    calculations: []
  });

  // Step 2: Calculate hidden layer
  const hiddenCalculations: CalculationStep[] = [];
  for (let j = 0; j < 4; j++) {
    const hiddenNeuron = neurons[4 + j];
    let weightedSum = 0;
    const inputContributions: { from: string; value: number; weight: number }[] = [];

    for (let i = 0; i < 4; i++) {
      const contribution = inputs[i] * weights.inputToHidden[i][j];
      weightedSum += contribution;
      inputContributions.push({
        from: `input-${i}`,
        value: inputs[i],
        weight: weights.inputToHidden[i][j]
      });
    }

    weightedSum += weights.hiddenBias[j];
    const output = sigmoid(weightedSum);

    hiddenNeuron.weightedSum = weightedSum;
    hiddenNeuron.bias = weights.hiddenBias[j];
    hiddenNeuron.value = output;
    hiddenNeuron.activated = true;

    hiddenCalculations.push({
      neuronId: hiddenNeuron.id,
      inputs: inputContributions,
      weightedSum,
      bias: weights.hiddenBias[j],
      output,
      formula: `σ(${weightedSum.toFixed(3)} + ${weights.hiddenBias[j].toFixed(3)}) = ${output.toFixed(3)}`
    });
  }

  steps.push({
    step: 2,
    description: "Hidden layer neurons calculate weighted sums and apply activation function",
    activeNeurons: neurons.slice(4, 8).map(n => n.id),
    activeConnections: [],
    calculations: hiddenCalculations
  });

  // Step 3: Calculate output layer
  const outputNeuron = neurons[8];
  let outputWeightedSum = 0;
  const hiddenContributions: { from: string; value: number; weight: number }[] = [];

  for (let i = 0; i < 4; i++) {
    const hiddenValue = neurons[4 + i].value;
    const contribution = hiddenValue * weights.hiddenToOutput[i];
    outputWeightedSum += contribution;
    hiddenContributions.push({
      from: `hidden-${i}`,
      value: hiddenValue,
      weight: weights.hiddenToOutput[i]
    });
  }

  outputWeightedSum += weights.outputBias;
  const finalOutput = sigmoid(outputWeightedSum);

  outputNeuron.weightedSum = outputWeightedSum;
  outputNeuron.bias = weights.outputBias;
  outputNeuron.value = finalOutput;
  outputNeuron.activated = true;

  steps.push({
    step: 3,
    description: "Output neuron calculates final prediction",
    activeNeurons: [outputNeuron.id],
    activeConnections: [],
    calculations: [{
      neuronId: outputNeuron.id,
      inputs: hiddenContributions,
      weightedSum: outputWeightedSum,
      bias: weights.outputBias,
      output: finalOutput,
      formula: `σ(${outputWeightedSum.toFixed(3)} + ${weights.outputBias.toFixed(3)}) = ${finalOutput.toFixed(3)}`
    }]
  });

  // Calculate feature importance
  const featureImportance = calculateFeatureImportance(inputs, weights, neurons);

  return { steps, finalOutput, neurons, featureImportance };
};

// Calculate feature importance using gradient-based method
export const calculateFeatureImportance = (
  inputs: number[],
  weights: NetworkWeights,
  neurons: Neuron[]
): FeatureImportance[] => {
  const features = ['Temperature', 'Humidity', 'Wind Speed', 'Solar Radiation'];
  const importance: FeatureImportance[] = [];

  for (let i = 0; i < 4; i++) {
    let totalContribution = 0;
    
    // Calculate contribution through each hidden neuron
    for (let j = 0; j < 4; j++) {
      const hiddenContribution = inputs[i] * weights.inputToHidden[i][j] * weights.hiddenToOutput[j];
      totalContribution += Math.abs(hiddenContribution);
    }

    importance.push({
      feature: features[i],
      importance: totalContribution,
      contribution: inputs[i] * totalContribution
    });
  }

  // Normalize importance values
  const maxImportance = Math.max(...importance.map(f => f.importance));
  importance.forEach(f => {
    f.importance = (f.importance / maxImportance) * 100;
  });

  return importance.sort((a, b) => b.importance - a.importance);
};

// Preset scenarios
export const presetScenarios: PresetScenario[] = [
  {
    name: "Sunny Summer Day",
    description: "High temperature, low humidity, moderate wind, high solar radiation",
    data: { temperature: 32, humidity: 35, windSpeed: 12, solarRadiation: 950 },
    expectedOutcome: "High renewable energy generation expected"
  },
  {
    name: "Windy Winter Day",
    description: "Low temperature, high humidity, strong wind, low solar radiation",
    data: { temperature: 5, humidity: 85, windSpeed: 25, solarRadiation: 200 },
    expectedOutcome: "Moderate energy generation, primarily from wind"
  },
  {
    name: "Cloudy Spring Day",
    description: "Moderate temperature, moderate humidity, light wind, medium solar radiation",
    data: { temperature: 18, humidity: 60, windSpeed: 8, solarRadiation: 500 },
    expectedOutcome: "Balanced but moderate energy generation"
  },
  {
    name: "Calm Night",
    description: "Cool temperature, high humidity, no wind, no solar radiation",
    data: { temperature: 12, humidity: 90, windSpeed: 2, solarRadiation: 0 },
    expectedOutcome: "Very low renewable energy generation"
  },
  {
    name: "Perfect Conditions",
    description: "Optimal temperature, low humidity, good wind, maximum solar radiation",
    data: { temperature: 25, humidity: 40, windSpeed: 15, solarRadiation: 1000 },
    expectedOutcome: "Maximum renewable energy generation"
  }
];