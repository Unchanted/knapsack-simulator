import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { sampleProblems } from "../utils/sampleData";
import { motion } from "framer-motion";

const ItemInput = ({
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
  capacity,
  onCapacityChange,
  mode,
  onLoadItems,
  onClearAllItems,
}) => {
  const [newItem, setNewItem] = useState({ value: "", weight: "" });
  const [editingId, setEditingId] = useState(null);
  const [showSamples, setShowSamples] = useState(false);

  const handleAddItem = () => {
    const value = parseInt(newItem.value);
    const weight = parseFloat(newItem.weight);

    if (isNaN(value) || isNaN(weight) || value <= 0 || weight <= 0) {
      alert("Please enter valid positive numbers for value and weight");
      return;
    }

    onAddItem({ value, weight });
    setNewItem({ value: "", weight: "" });
  };

  const handleEditStart = (item) => {
    setEditingId(item.id);
    setNewItem({
      value: item.value.toString(),
      weight: item.weight.toString(),
    });
  };

  const handleEditSave = () => {
    const value = parseInt(newItem.value);
    const weight = parseFloat(newItem.weight);

    if (isNaN(value) || isNaN(weight) || value <= 0 || weight <= 0) {
      alert("Please enter valid positive numbers for value and weight");
      return;
    }

    onEditItem(editingId, { value, weight });
    setEditingId(null);
    setNewItem({ value: "", weight: "" });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setNewItem({ value: "", weight: "" });
  };

  const handleCapacityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onCapacityChange(value);
    }
  };

  const loadSampleProblem = (problem) => {
    onCapacityChange(problem.capacity);

    onLoadItems(problem.items);

    setShowSamples(false);
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">Input Parameters</h2>

      <div className="mb-4">
        <label className="block mb-2">Knapsack Capacity</label>
        <input
          type="number"
          value={capacity}
          onChange={handleCapacityChange}
          min="1"
          className="w-full px-3 py-2 bg-white/20 rounded-lg text-white"
        />
      </div>

      <h3 className="font-bold mb-2">Items</h3>

      <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-2">
        <input
          type="number"
          placeholder="Value"
          value={newItem.value}
          onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
          className="flex-1 w-full sm:w-auto min-w-[100px] px-3 py-2 bg-white/20 rounded-lg text-white"
        />
        <input
          type="number"
          placeholder="Weight"
          value={newItem.weight}
          onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
          className="flex-1 w-full sm:w-auto min-w-[100px] px-3 py-2 bg-white/20 rounded-lg text-white"
          step={mode === "greedy" ? "0.1" : "1"}
        />
        {editingId === null ? (
          <button
            onClick={handleAddItem}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center justify-center sm:justify-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-1 sm:hidden">Add Item</span>
          </button>
        ) : (
          <div className="flex w-full sm:w-auto gap-1 justify-center">
            <button
              onClick={handleEditSave}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-1 sm:hidden">Save</span>
            </button>
            <button
              onClick={handleEditCancel}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-1 sm:hidden">Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="relative mb-4">
        <button
          onClick={() => setShowSamples(!showSamples)}
          className="w-full py-2 bg-indigo-600/70 hover:bg-indigo-700/70 text-white rounded-lg flex items-center justify-center"
        >
          <span>Load Sample Problem</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ml-2 transition-transform duration-300 ${showSamples ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <AnimatePresence>
          {showSamples && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 z-10 mt-1 bg-white/20 backdrop-blur-md rounded-lg overflow-hidden"
            >
              <ul className="p-2">
                {sampleProblems.map((problem, index) => (
                  <li key={index}>
                    <button
                      onClick={() => loadSampleProblem(problem)}
                      className="w-full text-left p-2 hover:bg-white/20 rounded-lg transition-colors duration-300"
                    >
                      {problem.name} ({problem.items.length} items)
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {items.length > 0 && (
        <button
          onClick={onClearAllItems}
          className="w-full py-2 mb-4 bg-red-600/70 hover:bg-red-700/70 text-white rounded-lg flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Clear All Items</span>
        </button>
      )}

      <div className="flex-1 overflow-y-auto pr-2">
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4 text-white/60"
            >
              No items added yet
            </motion.div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between bg-white/20 p-3 rounded-lg"
                >
                  <div>
                    <span className="font-mono">{`Value: ${item.value}`}</span>
                    <span className="mx-2">|</span>
                    <span className="font-mono">{`Weight: ${item.weight}`}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditStart(item)}
                      className="text-white hover:text-yellow-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-white hover:text-red-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ItemInput;
