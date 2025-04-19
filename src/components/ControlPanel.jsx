import React, { useRef, useEffect } from 'react'
import anime from 'animejs'

const ControlPanel = ({ 
  isPlaying,
  startAnimation,
  pauseAnimation,
  resetAnimation,
  stepForward,
  stepBackward,
  currentStep,
  totalSteps,
  capacity,
  updateCapacity,
  animationSpeed,
  updateAnimationSpeed
}) => {
  const progressBarRef = useRef(null)
  const buttonRefs = useRef({
    reset: null,
    back: null,
    play: null,
    next: null
  })

  // Animate progress bar when steps change
  useEffect(() => {
    if (progressBarRef.current) {
      anime({
        targets: progressBarRef.current,
        width: totalSteps ? `${(currentStep / (totalSteps - 1)) * 100}%` : '0%',
        duration: 400,
        easing: 'easeOutQuad'
      })
    }
  }, [currentStep, totalSteps])

  // Button hover effects
  useEffect(() => {
    // Setup button hover animations
    Object.entries(buttonRefs.current).forEach(([key, el]) => {
      if (!el) return

      // Remove previous event listeners
      const clone = el.cloneNode(true)
      el.parentNode.replaceChild(clone, el)
      buttonRefs.current[key] = clone

      // Add new event listeners
      clone.addEventListener('mouseenter', () => {
        anime({
          targets: clone,
          scale: 1.05,
          duration: 200,
          easing: 'easeOutQuad'
        })
      })

      clone.addEventListener('mouseleave', () => {
        anime({
          targets: clone,
          scale: 1,
          duration: 200,
          easing: 'easeOutQuad'
        })
      })

      clone.addEventListener('mousedown', () => {
        anime({
          targets: clone,
          scale: 0.95,
          duration: 100,
          easing: 'easeOutQuad'
        })
      })

      clone.addEventListener('mouseup', () => {
        anime({
          targets: clone,
          scale: 1.05,
          duration: 200,
          easing: 'easeOutQuad'
        })
      })
    })
  }, [])

  // Animate play button when status changes
  useEffect(() => {
    const playButton = buttonRefs.current.play
    if (playButton) {
      anime({
        targets: playButton,
        scale: [0.95, 1.05, 1],
        duration: 400,
        easing: 'easeOutElastic(1, .6)'
      })
    }
  }, [isPlaying])

  return (
    <div className="space-y-4">
      {/* Capacity Control */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Knapsack Capacity
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="10"
            max="100"
            value={capacity}
            onChange={(e) => updateCapacity(e.target.value)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="bg-gray-700 rounded px-2 py-1 min-w-[40px] text-center">
            {capacity}
          </span>
        </div>
      </div>
      
      {/* Animation Speed Control */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-300">
          Animation Speed
        </label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Slow</span>
          <input
            type="range"
            min="100"
            max="900"
            value={animationSpeed}
            onChange={(e) => updateAnimationSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-400">Fast</span>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-xs">{currentStep} / {totalSteps > 0 ? totalSteps - 1 : 0}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            ref={progressBarRef}
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: totalSteps ? `${(currentStep / (totalSteps - 1)) * 100}%` : '0%' }}
          />
        </div>
      </div>
      
      {/* Control buttons */}
      <div className="flex justify-between gap-2">
        <button
          ref={el => buttonRefs.current.reset = el}
          onClick={resetAnimation}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm"
        >
          Reset
        </button>
        
        <button
          ref={el => buttonRefs.current.back = el}
          onClick={stepBackward}
          disabled={currentStep === 0}
          className={`flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm ${
            currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          ← Back
        </button>
        
        {isPlaying ? (
          <button
            ref={el => buttonRefs.current.play = el}
            onClick={pauseAnimation}
            className="flex-1 bg-accent hover:bg-yellow-500 text-white py-2 px-3 rounded-lg text-sm"
          >
            Pause
          </button>
        ) : (
          <button
            ref={el => buttonRefs.current.play = el}
            onClick={startAnimation}
            className="flex-1 bg-primary hover:bg-indigo-600 text-white py-2 px-3 rounded-lg text-sm"
          >
            {currentStep === 0 ? 'Start' : 'Continue'}
          </button>
        )}
        
        <button
          ref={el => buttonRefs.current.next = el}
          onClick={stepForward}
          disabled={currentStep >= totalSteps - 1}
          className={`flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm ${
            currentStep >= totalSteps - 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default ControlPanel 