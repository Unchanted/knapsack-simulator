import React from 'react'

const KnapsackControls = ({ 
  onStart, 
  onContinue, 
  onStep, 
  isRunning, 
  autoRun, 
  setAutoRun, 
  speed, 
  setSpeed,
  showIntermediates,
  setShowIntermediates,
  algorithmComplete,
  hasTable
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {!hasTable && (
          <button
            onClick={onStart}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${isRunning ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-hover shadow-md'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Start Algorithm
          </button>
        )}
        
        {hasTable && !isRunning && !algorithmComplete && (
          <button
            onClick={onContinue}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            {autoRun ? 'Continue' : 'Run'}
          </button>
        )}
        
        {isRunning && (
          <button
            onClick={() => setAutoRun(false)}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
            Pause
          </button>
        )}
        
        {hasTable && !isRunning && !algorithmComplete && (
          <button
            onClick={onStep}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" transform="rotate(90 10 10)" />
            </svg>
            Step
          </button>
        )}
        
        {hasTable && !isRunning && algorithmComplete && (
          <div className="px-4 py-2 bg-green-800 text-white rounded-lg font-medium flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Algorithm Complete
          </div>
        )}
      </div>
      
      <div className="bg-gray-800 rounded-lg p-3 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-300 flex items-center gap-2">
            <span>Auto Run:</span>
            <div 
              className={`relative inline-block w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${autoRun ? 'bg-primary' : 'bg-gray-600'}`}
              onClick={() => setAutoRun(!autoRun)}
            >
              <span 
                className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${autoRun ? 'transform translate-x-5' : ''}`}
              ></span>
            </div>
          </label>
          
          <label className="text-sm text-gray-300 flex items-center gap-2">
            <span>Show Intermediates:</span>
            <div 
              className={`relative inline-block w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${showIntermediates ? 'bg-primary' : 'bg-gray-600'}`}
              onClick={() => setShowIntermediates(!showIntermediates)}
            >
              <span 
                className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${showIntermediates ? 'transform translate-x-5' : ''}`}
              ></span>
            </div>
          </label>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300 w-20">Speed:</span>
          <input 
            type="range" 
            min="100" 
            max="2000" 
            step="100" 
            value={speed} 
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="text-xs text-gray-400 w-16 text-right">{Math.round(10 * (2100 - speed) / 2000) / 10}x</span>
        </div>
      </div>
    </div>
  )
}

export default KnapsackControls 