# 0/1 Knapsack Algorithm Visualization

An interactive web application to visualize the 0/1 Knapsack algorithm using dynamic programming.

## Features

- Interactive visualization of the dynamic programming approach
- Step-by-step explanation of the algorithm execution
- Ability to add, edit, and remove items
- Adjustable knapsack capacity and animation speed
- Real-time visualization of selected items in the knapsack
- Detailed algorithm explanation
- Smooth animations with Anime.js

## Technologies Used

- React
- Anime.js for animations
- Tailwind CSS for styling
- Vite for bundling and development

## Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Running the Application

To start the development server:

```bash
npm run dev
```

This will start the application on http://localhost:5173 (or another port if 5173 is in use).

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be generated in the `dist` directory.

## How to Use

1. Add or edit items with their weights and values
2. Set the knapsack capacity using the slider
3. Use the play button to run the complete animation
4. Use the step forward/backward buttons to navigate through the algorithm step by step
5. The table shows the dynamic programming matrix being filled
6. The knapsack visualization shows which items are selected in the optimal solution

## Project Structure

- `src/components/` - React components
  - `KnapsackVisualizer.jsx` - Main component that manages the simulation
  - `KnapsackTable.jsx` - Renders the DP table
  - `ItemsList.jsx` - Manages the list of available items
  - `KnapsackSack.jsx` - Visualizes the knapsack and selected items
  - `ControlPanel.jsx` - Controls for the simulation
  - `AlgorithmExplanation.jsx` - Explanation of the algorithm

## License

MIT 