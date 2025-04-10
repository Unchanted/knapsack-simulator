import { useState } from 'react';
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

  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="glass rounded-xl p-4 mb-4">
      <div className="flex flex-wrap gap-3 justify-center">
        {/* Main controls */}
        <button
          onClick={solution ? reset : solve}
          className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${solution ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {solution ? 'Reset' : 'Solve Knapsack'}
        </button>

        {solution && (
          <button
            onClick={isAnimating ? pauseAnimation : startAnimation}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${isAnimating ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
          >
            {isAnimating ? 'Pause Animation' : 'Animate'}
          </button>
        )}

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
        >
          {showSettings ? 'Hide Settings' : 'Settings'}
        </button>
      </div>

      {showSettings && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-4 overflow-hidden"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Knapsack Capacity: {capacity}
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Generate Random Items
              </label>
              <div className="flex flex-wrap gap-2">
                {[3, 5, 7, 10].map(count => (
                  <button
                    key={count}
                    onClick={() => generateRandomItems(count)}
                    className="px-2 py-1 rounded text-sm bg-slate-700 hover:bg-slate-600"
                  >
                    {count} items
                  </button>
                ))}
              </div>
            </div>

            {solution && (
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Animation Progress: {currentStateIndex + 1} / {solution.states.length}
                </label>
                <input
                  type="range"
                  min="0"
                  max={solution.states.length - 1}
                  value={currentStateIndex}
                  onChange={(e) => setCurrentStateIndex(parseInt(e.target.value))}
                  disabled={isAnimating}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
