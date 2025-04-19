import { useState, useRef, useEffect } from 'react'
import anime from 'animejs'
import './App.css'
import KnapsackVisualizer from './components/KnapsackVisualizer'
import AlgorithmExplanation from './components/AlgorithmExplanation'

function App() {
  const headerRef = useRef(null)
  
  useEffect(() => {
    if (headerRef.current) {
      anime({
        targets: headerRef.current,
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 800,
        easing: 'easeOutQuad'
      })
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-background text-white p-4 pb-12">
      <header 
        ref={headerRef}
        className="mb-6 opacity-0"
        style={{ transform: 'translateY(-20px)' }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">0/1 Knapsack Algorithm Visualization</h1>
        <p className="text-center text-gray-300 mt-2">Dynamic Programming Approach</p>
      </header>
      
      <main className="w-full max-w-6xl mx-auto px-2">
        <KnapsackVisualizer />
        <AlgorithmExplanation />
      </main>
      
      <footer className="mt-8 text-center text-gray-400 text-sm">
        <p>Created with React, Anime.js, and Tailwind CSS</p>
      </footer>
    </div>
  )
}

export default App 