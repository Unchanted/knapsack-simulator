import { useState } from 'react';
import useKnapsackStore from '../store/knapsackStore';

export default function ControlPanel() {
  const { 
    items, 
    capacity, 
    solution, 
    currentStep,
    isPlaying,
    playbackSpeed,
    isGeneratingItems,
    setCapacity,
    addItem,
    removeItem,
    solve,
    reset,
    generateNewItems,
    nextStep,
    prevStep,
    playSimulation,
    pauseSimulation,
    setPlaybackSpeed
  } = useKnapsackStore();
  
  
  const [itemValue, setItemValue] = useState('');
  const [itemWeight, setItemWeight] = useState('');
  const [newCapacity, setNewCapacity] = useState(capacity.toString());
  const [itemCount, setItemCount] = useState('5');
  
  
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseInt(itemValue);
    const weight = parseInt(itemWeight);
    
    if (!isNaN(value) && !isNaN(weight) && value > 0 && weight > 0) {
      addItem({
        id: `item-${Date.now()}`,
        value,
        weight
      });
      setItemValue('');
      setItemWeight('');
    }
  };
  
  const handleCapacityChange = (e: React.FormEvent) => {
    e.preventDefault();
    const cap = parseInt(newCapacity);
    
    if (!isNaN(cap) && cap > 0) {
      setCapacity(cap);
    }
  };
  
  const handleGenerateItems = () => {
    const count = parseInt(itemCount);
    if (!isNaN(count) && count > 0) {
      generateNewItems(count);
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-lg z-10 border-t border-nebula-secondary/30 shadow-[0_-5px_25px_rgba(138,43,226,0.2)]">
      <div className="max-w-7xl mx-auto px-4 py-2">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          
          <div className="bg-black/60 rounded-lg p-3 backdrop-blur-md border border-nebula-primary/30 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-bold bg-gradient-to-r from-nebula-secondary to-nebula-accent bg-clip-text text-transparent">
                Items
              </h2>
              
              <div className="flex gap-1">
                <button 
                  onClick={() => reset()}
                  className="text-xs text-gray-400 hover:text-red-400 px-2 py-1 rounded border border-gray-800 hover:border-red-900/40 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={handleGenerateItems}
                  disabled={isGeneratingItems}
                  className="text-xs bg-gradient-to-r from-nebula-secondary/70 to-nebula-accent/70 hover:from-nebula-secondary hover:to-nebula-accent text-white px-2 py-1 rounded transition-all shadow-md shadow-nebula-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingItems ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 mb-2">
              <form onSubmit={handleAddItem} className="flex gap-1 flex-1">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Value"
                    value={itemValue}
                    onChange={(e) => setItemValue(e.target.value)}
                    className="bg-black/50 border border-nebula-primary/30 rounded-md px-2 py-1 w-full text-white text-sm focus:outline-none focus:ring-1 focus:ring-nebula-secondary/50 focus:border-nebula-secondary/50"
                  />
                </div>
                
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Weight"
                    value={itemWeight}
                    onChange={(e) => setItemWeight(e.target.value)}
                    className="bg-black/50 border border-nebula-primary/30 rounded-md px-2 py-1 w-full text-white text-sm focus:outline-none focus:ring-1 focus:ring-nebula-secondary/50 focus:border-nebula-secondary/50"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-nebula-primary/70 to-nebula-secondary/70 hover:from-nebula-primary hover:to-nebula-secondary text-white px-2 py-1 rounded-md text-sm transition-all shadow-md shadow-nebula-primary/20"
                >
                  Add
                </button>
              </form>
              
              <div className="w-16">
                <input
                  type="number"
                  placeholder="Count"
                  value={itemCount}
                  onChange={(e) => setItemCount(e.target.value)}
                  className="bg-black/50 border border-nebula-primary/30 rounded-md px-2 py-1 w-full text-white text-sm focus:outline-none focus:ring-1 focus:ring-nebula-secondary/50 focus:border-nebula-secondary/50"
                />
              </div>
            </div>
            
            
            <div className="h-[110px] overflow-auto scrollbar-thin scrollbar-thumb-nebula-primary/30 scrollbar-track-black/20 pr-1">
              <div className="grid grid-cols-1 gap-1">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className={`flex justify-between items-center px-2 py-1 rounded text-xs ${
                      solution?.selectedItems.some(i => i.id === item.id) 
                        ? 'bg-nebula-primary/20 border border-nebula-primary/40 shadow-[0_0_10px_rgba(138,43,226,0.2)]' 
                        : 'bg-gray-900/40 border border-gray-800/40'
                    } transition-all duration-300`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        solution?.selectedItems.some(i => i.id === item.id) 
                          ? 'bg-nebula-secondary animate-pulse' 
                          : 'bg-gray-600'
                      }`}></div>
                      <span>
                        <span className="text-nebula-secondary font-medium">V: {item.value}</span>
                        <span className="mx-1 text-gray-600">|</span>
                        <span className="text-nebula-accent font-medium">W: {item.weight}</span>
                        <span className="mx-1 text-gray-600">|</span>
                        <span className="text-gray-400">R: {(item.value / item.weight).toFixed(1)}</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-900/20"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {items.length === 0 && (
                  <div className="text-center py-8 text-gray-500 italic text-sm">
                    No items yet
                  </div>
                )}
              </div>
            </div>
          </div>
          
          
          <div className="bg-black/60 rounded-lg p-3 backdrop-blur-md border border-nebula-accent/30 shadow-lg">
            <h2 className="text-sm font-bold bg-gradient-to-r from-nebula-secondary to-nebula-accent bg-clip-text text-transparent mb-2">
              Algorithm Controls
            </h2>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <form onSubmit={handleCapacityChange} className="flex gap-1 items-center">
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Max Capacity"
                      value={newCapacity}
                      onChange={(e) => setNewCapacity(e.target.value)}
                      className="bg-black/50 border border-nebula-primary/30 rounded-md px-2 py-1 w-20 text-white text-sm focus:outline-none focus:ring-1 focus:ring-nebula-secondary/50 focus:border-nebula-secondary/50"
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-nebula-primary/70 to-nebula-secondary/70 hover:from-nebula-primary hover:to-nebula-secondary text-white px-2 py-1 rounded-md text-sm transition-all shadow-md shadow-nebula-primary/20"
                  >
                    Set Capacity
                  </button>
                </form>
                
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">Speed:</span>
                  <select
                    value={playbackSpeed.toString()}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="bg-black/50 border border-nebula-primary/30 rounded-md px-1 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-nebula-secondary/50 focus:border-nebula-secondary/50"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="1">1x</option>
                    <option value="2">2x</option>
                    <option value="4">4x</option>
                  </select>
                </div>
              </div>
              
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/40 rounded-md border border-nebula-secondary/30 shadow-inner p-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Value</div>
                    <div className="text-lg font-bold text-nebula-secondary">
                      {solution ? solution.maxValue : '—'}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Weight</div>
                    <div className="text-sm text-nebula-accent">
                      {solution 
                        ? `${solution.selectedItems.reduce((sum, item) => sum + item.weight, 0)} / ${capacity}`
                        : '—'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/40 rounded-md border border-nebula-secondary/30 shadow-inner p-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Step</div>
                    <div className="text-lg font-bold text-nebula-primary">
                      {solution ? currentStep : '—'}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Items</div>
                    <div className="text-sm text-nebula-accent">
                      {solution 
                        ? `${solution.selectedItems.length} / ${items.length}`
                        : '—'}
                    </div>
                  </div>
                </div>
              </div>
              
              
              <div className="flex justify-between gap-2">
                <button 
                  onClick={() => solve()}
                  disabled={items.length === 0 || isPlaying}
                  className="flex-1 bg-gradient-to-r from-nebula-secondary to-nebula-accent hover:from-nebula-secondary/90 hover:to-nebula-accent/90 text-white py-1.5 rounded-md text-sm font-medium transition-all shadow-md shadow-nebula-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Solve
                </button>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => prevStep()}
                    disabled={!solution || currentStep <= 0 || isPlaying}
                    className="bg-black/50 border border-nebula-primary/30 rounded-md w-8 h-8 flex items-center justify-center text-white transition-all hover:bg-nebula-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ◀
                  </button>
                  
                  <button 
                    onClick={() => isPlaying ? pauseSimulation() : playSimulation()}
                    disabled={!solution}
                    className={`bg-black/50 border ${isPlaying ? 'border-red-500/70' : 'border-green-500/70'} rounded-md w-8 h-8 flex items-center justify-center text-white transition-all hover:bg-nebula-primary/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  
                  <button 
                    onClick={() => nextStep()}
                    disabled={!solution || isPlaying}
                    className="bg-black/50 border border-nebula-primary/30 rounded-md w-8 h-8 flex items-center justify-center text-white transition-all hover:bg-nebula-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          
          <div className="bg-black/60 rounded-lg p-3 backdrop-blur-md border border-nebula-primary/30 shadow-lg">
            <h2 className="text-sm font-bold bg-gradient-to-r from-nebula-secondary to-nebula-accent bg-clip-text text-transparent mb-2">
              Solution Details
            </h2>
            
            {solution ? (
              <div className="h-[110px] overflow-auto scrollbar-thin scrollbar-thumb-nebula-primary/30 scrollbar-track-black/20 pr-1">
                <div className="grid grid-cols-1 gap-1">
                  {solution.selectedItems.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-nebula-primary/20 border border-nebula-primary/40 px-2 py-1 rounded text-xs flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-nebula-secondary animate-pulse"></div>
                        <span>
                          <span className="text-nebula-secondary font-medium">V: {item.value}</span>
                          <span className="mx-1 text-gray-600">|</span>
                          <span className="text-nebula-accent font-medium">W: {item.weight}</span>
                          <span className="mx-1 text-gray-600">|</span>
                          <span className="text-green-400 font-medium">Selected</span>
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {solution.selectedItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500 italic text-sm">
                      No items selected
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[110px] text-center text-gray-500 italic text-sm">
                <p>Run the algorithm to see solution details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 