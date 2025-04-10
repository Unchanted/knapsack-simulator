import { motion } from 'framer-motion';
import useKnapsackStore from '../../store/knapsackStore';

export default function KnapsackControls() {
  const {
    capacity,
    setCapacity,
    solve,
    solution,
    reset,
    generateRandomItems,
    currentStateIndex,
    setCurrentStateIndex,
    isAnimating,
    startAnimation,
    pauseAnimation,
    animationSpeed,
    setAnimationSpeed
  } = useKnapsackStore();

  const handleSolve = () => {
    solve();
  };

  return (
    <div className="glass rounded-lg p-4 mb-4">
      <h3 className="text-xl font-bold mb-3 text-primary-300">Knapsack Controls</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-200">
            Knapsack Capacity
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-200">
            Generate Random Items
          </label>
          <div className="mt-1 flex space-x-2">
            {[3, 5, 7, 10].map(count => (
              <button
                key={count}
                onClick={() => generateRandomItems(count)}
                className="px-2 py-1 rounded text-sm bg-gray-800 hover:bg-gray-700"
              >
                {count} items
              </button>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-200">
            Animation Speed
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={2100 - animationSpeed}
            onChange={(e) => setAnimationSpeed(2100 - parseInt(e.target.value))}
            disabled={isAnimating}
            className="mt-1 block w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSolve}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium"
        >
          Solve Knapsack
        </motion.button>

        {solution && (
          <>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={isAnimating ? pauseAnimation : startAnimation}
              className={`px-4 py-2 ${isAnimating ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'} rounded-lg text-white font-medium`}
            >
              {isAnimating ? 'Pause Animation' : 'Start Animation'}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={reset}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium"
            >
              Reset
            </motion.button>
          </>
        )}
      </div>

      {solution && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">
              Animation Progress: {currentStateIndex} / {solution.states.length - 1}
            </span>

            <div className="text-sm bg-green-900 px-2 py-1 rounded">
              Max Value: <span className="font-bold text-green-300">{solution.maxValue}</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max={solution.states.length - 1}
            value={currentStateIndex}
            onChange={(e) => setCurrentStateIndex(parseInt(e.target.value))}
            disabled={isAnimating}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
