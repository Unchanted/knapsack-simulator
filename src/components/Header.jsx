import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const Header = ({
  isPlaying,
  onPlayPause,
  onStepForward,
  onReset,
  speed,
  onSpeedChange,
  mode,
  onModeChange,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const TooltipModal = () => {
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);

    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div
          className="bg-white text-black rounded-xl shadow-2xl overflow-hidden max-w-3xl w-full max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
            <h2 className="font-bold text-xl">
              Knapsack Problem Simulator Guide
            </h2>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-white hover:text-indigo-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <section className="mb-6">
              <h3 className="font-bold text-lg mb-2 text-indigo-700 border-b border-indigo-200 pb-1">
                What is the Knapsack Problem?
              </h3>
              <p className="mb-3">
                The knapsack problem is a classic optimization problem: given a
                set of items, each with a weight and value, determine which
                items to include in a collection so that the total weight is
                less than or equal to a given limit and the total value is as
                large as possible.
              </p>
            </section>

            <section className="mb-6">
              <h3 className="font-bold text-lg mb-2 text-indigo-700 border-b border-indigo-200 pb-1">
                Algorithms
              </h3>

              <div className="mb-4 bg-indigo-50 p-3 rounded-lg">
                <h4 className="font-bold text-md mb-1 text-indigo-700">
                  0/1 Knapsack (Dynamic Programming)
                </h4>
                <p className="mb-2">
                  In the 0/1 Knapsack problem, each item can either be included
                  entirely (1) or not at all (0).
                </p>
                <div className="pl-3 border-l-4 border-indigo-300 mb-2">
                  <p className="mb-1">
                    <span className="font-semibold">Algorithm Steps:</span>
                  </p>
                  <ol className="list-decimal ml-5 mb-3 text-sm">
                    <li>
                      Create a 2D table with items as rows and weights from 0 to
                      capacity as columns
                    </li>
                    <li>
                      Fill the first row and column with zeros (base case)
                    </li>
                    <li>For each item and each weight capacity:</li>
                    <ul className="list-disc ml-5 mb-1">
                      <li>
                        If the item's weight exceeds current capacity, use the
                        value from excluding this item
                      </li>
                      <li>
                        Otherwise, take the maximum of including vs excluding
                        the item
                      </li>
                    </ul>
                    <li>
                      The bottom-right cell contains the maximum achievable
                      value
                    </li>
                    <li>
                      Backtrack through the table to determine which items were
                      selected
                    </li>
                  </ol>
                  <p className="mb-1 text-sm">
                    <span className="font-semibold">Time Complexity:</span> O(n
                    × W) where n is the number of items and W is the capacity
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Space Complexity:</span> O(n
                    × W)
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg">
                <h4 className="font-bold text-md mb-1 text-indigo-700">
                  Fractional Knapsack (Greedy)
                </h4>
                <p className="mb-2">
                  In the Fractional Knapsack problem, items can be broken into
                  smaller pieces, so we can take fractions of items.
                </p>
                <div className="pl-3 border-l-4 border-indigo-300 mb-2">
                  <p className="mb-1">
                    <span className="font-semibold">Algorithm Steps:</span>
                  </p>
                  <ol className="list-decimal ml-5 mb-3 text-sm">
                    <li>Calculate the value-to-weight ratio for each item</li>
                    <li>
                      Sort all items by value-to-weight ratio in descending
                      order
                    </li>
                    <li>
                      Initialize result value to 0 and remaining capacity to W
                    </li>
                    <li>For each item in the sorted order:</li>
                    <ul className="list-disc ml-5 mb-1">
                      <li>
                        If the entire item fits, take it all and update
                        remaining capacity
                      </li>
                      <li>
                        Otherwise, take a fraction of the item that fits in
                        remaining capacity
                      </li>
                    </ul>
                  </ol>
                  <p className="mb-1 text-sm">
                    <span className="font-semibold">Time Complexity:</span> O(n
                    log n) due to sorting
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Space Complexity:</span>{" "}
                    O(n)
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <h3 className="font-bold text-lg mb-2 text-indigo-700 border-b border-indigo-200 pb-1">
                Using the Simulator
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <h4 className="font-bold text-md mb-1 text-indigo-700">
                    Input Parameters
                  </h4>
                  <ul className="list-disc ml-5 mb-1 text-sm">
                    <li>
                      <span className="font-semibold">Add Items:</span> Set
                      value and weight for each item
                    </li>
                    <li>
                      <span className="font-semibold">Knapsack Capacity:</span>{" "}
                      Set the maximum weight
                    </li>
                    <li>
                      <span className="font-semibold">Sample Problems:</span>{" "}
                      Load predefined examples
                    </li>
                  </ul>
                </div>

                <div className="bg-indigo-50 p-3 rounded-lg">
                  <h4 className="font-bold text-md mb-1 text-indigo-700">
                    Controls
                  </h4>
                  <ul className="list-disc ml-5 mb-1 text-sm">
                    <li>
                      <span className="font-semibold">Play/Pause:</span>{" "}
                      Start/stop the simulation
                    </li>
                    <li>
                      <span className="font-semibold">Step:</span> Advance one
                      step at a time
                    </li>
                    <li>
                      <span className="font-semibold">Reset:</span> Return to
                      initial state
                    </li>
                    <li>
                      <span className="font-semibold">Speed:</span> Set
                      animation speed (1x-4x)
                    </li>
                  </ul>
                </div>

                <div className="bg-indigo-50 p-3 rounded-lg md:col-span-2">
                  <h4 className="font-bold text-md mb-1 text-indigo-700">
                    Visualization Components
                  </h4>
                  <ul className="list-disc ml-5 mb-1 text-sm">
                    <li>
                      <span className="font-semibold">DP Table:</span> Shows the
                      dynamic programming solution for 0/1 knapsack
                    </li>
                    <li>
                      <span className="font-semibold">Greedy Table:</span> Shows
                      items sorted by value/weight ratio for fractional knapsack
                    </li>
                    <li>
                      <span className="font-semibold">Knapsack:</span> Visually
                      represents items added to the knapsack with animations
                    </li>
                    <li>
                      <span className="font-semibold">Summary:</span> Shows the
                      final total value and weight information
                    </li>
                    <li>
                      <span className="font-semibold">Tooltips:</span> Hover
                      over cells and items for detailed information
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <div className="bg-gray-100 p-4 flex justify-end">
            <button
              onClick={() => setShowTooltip(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <motion.div
      className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg m-4 p-4 relative z-10"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="text-white bg-indigo-600/60 hover:bg-indigo-600/80 transition-colors p-2 rounded-full"
          aria-label="Information about Knapsack Simulator"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {showTooltip && <TooltipModal />}
      </div>

      <h1 className="text-3xl font-bold mb-4">Knapsack Simulator</h1>

      <div className="flex flex-wrap gap-4 items-center justify-center">
        <div className="bg-black/20 rounded-lg p-2">
          <div className="flex gap-2">
            <button
              onClick={onPlayPause}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow transition-colors"
            >
              {isPlaying ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <rect x="6" y="4" width="3" height="12" rx="1" />
                    <rect x="11" y="4" width="3" height="12" rx="1" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Play
                </>
              )}
            </button>

            <button
              onClick={onStepForward}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Step
            </button>

            <button
              onClick={onReset}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center shadow transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Reset
            </button>
          </div>
        </div>

        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">Speed:</span>
            <button
              onClick={() => onSpeedChange(1)}
              className={`px-3 py-1 rounded-md transition-all ${
                speed === 1
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              1x
            </button>
            <button
              onClick={() => onSpeedChange(2)}
              className={`px-3 py-1 rounded-md transition-all ${
                speed === 2
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              2x
            </button>
            <button
              onClick={() => onSpeedChange(4)}
              className={`px-3 py-1 rounded-md transition-all ${
                speed === 4
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              4x
            </button>
          </div>
        </div>

        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">Mode:</span>
            <button
              className={`px-4 py-2 rounded-lg ${
                mode === "dp"
                  ? "outline-2 outline-purple-500"
                  : "hover:outline-2 hover:outline-purple-500"
              }`}
              onClick={() => onModeChange("dp")}
            >
              0/1 Knapsack
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                mode === "greedy"
                  ? "outline-2 outline-purple-500"
                  : "hover:outline-2 hover:outline-purple-500"
              }`}
              onClick={() => onModeChange("greedy")}
            >
              Fractional Knapsack
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
