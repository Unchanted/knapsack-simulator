import { useState, useEffect } from "react";
import Header from "./components/Header";
import ItemInput from "./components/ItemInput";
import KnapsackVisualizer from "./components/KnapsackVisualizer";
import DPTable from "./components/DPTable";
import GreedyTable from "./components/GreedyTable";
import Summary from "./components/Summary";
import { motion } from "framer-motion";

function App() {
  const [items, setItems] = useState([]);
  const [capacity, setCapacity] = useState(10);
  const [mode, setMode] = useState("dp");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [step, setStep] = useState(0);
  const [solution, setSolution] = useState({
    maxValue: 0,
    selectedItems: [],
    dpTable: [],
    currentHighlight: null,
  });

  const handleCapacityChange = (value) => {
    setCapacity(value);
    resetSimulation();
  };

  const handleAddItem = (item) => {
    setItems([...items, { ...item, id: Date.now() }]);
    resetSimulation();
  };

  const handleLoadItems = (newItems) => {
    const itemsWithIds = newItems.map((item, index) => ({
      ...item,
      id: Date.now() + index,
    }));

    setItems(itemsWithIds);
    resetSimulation();
  };

  const handleEditItem = (id, updatedItem) => {
    setItems(
      items.map((item) => (item.id === id ? { ...updatedItem, id } : item)),
    );
    resetSimulation();
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    resetSimulation();
  };

  const handleClearAllItems = () => {
    setItems([]);
    resetSimulation();
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);

    setIsPlaying(false);
    setStep(0);
    setSolution({
      maxValue: 0,
      selectedItems: [],
      dpTable: [],
      currentHighlight: null,
    });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (step < getMaxSteps()) {
      setStep(step + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setStep(0);
    setSolution({
      maxValue: 0,
      selectedItems: [],
      dpTable: [],
      currentHighlight: null,
    });
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const getMaxSteps = () => {
    if (mode === "dp") {
      return (items.length + 1) * (capacity + 1);
    } else {
      return items.length + 1;
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying && step < getMaxSteps()) {
      const delay = 1000 / speed;
      timer = setTimeout(() => {
        handleStepForward();
      }, delay);
    } else if (step >= getMaxSteps()) {
      setIsPlaying(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isPlaying, step, speed]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onStepForward={handleStepForward}
        onReset={resetSimulation}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        mode={mode}
        onModeChange={handleModeChange}
      />

      { }
      <div className="flex-1 overflow-y-auto">
        <motion.div
          className="flex p-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          { }
          <div className="w-1/4 bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col gap-4 sticky top-4">
            <ItemInput
              items={items}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              capacity={capacity}
              onCapacityChange={handleCapacityChange}
              mode={mode}
              onLoadItems={handleLoadItems}
              onClearAllItems={handleClearAllItems}
            />
          </div>

          <div className="w-2/4 bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col">
            {mode === "dp" ? (
              <DPTable
                items={items}
                capacity={capacity}
                step={step}
                solution={solution}
                setSolution={setSolution}
              />
            ) : (
              <GreedyTable
                items={items}
                capacity={capacity}
                step={step}
                solution={solution}
                setSolution={setSolution}
              />
            )}
          </div>

          { }
          <div className="w-1/4 bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col">
            <KnapsackVisualizer
              items={items}
              capacity={capacity}
              selectedItems={solution.selectedItems}
              mode={mode}
            />
          </div>
        </motion.div>

        { }
        {step >= getMaxSteps() && (
          <motion.div
            className="w-full bg-white/10 backdrop-blur-md rounded-lg p-4 mx-4 mb-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Summary
              maxValue={solution.maxValue}
              selectedItems={solution.selectedItems}
              mode={mode}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
