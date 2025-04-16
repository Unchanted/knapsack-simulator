import { useEffect, useState } from 'react'
import KnapsackScene from './scenes/KnapsackScene'
import ControlPanel from './components/ControlPanel'
import KnapsackTable from './components/KnapsackTable'
import useKnapsackStore from './store/knapsackStore'
import './App.css'

function App() {
  const { generateNewItems } = useKnapsackStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    generateNewItems(5)
  }, [generateNewItems])

  return (
    <div className="relative h-screen overflow-hidden">
      <KnapsackScene />
      
      <div className={`fixed top-0 right-0 h-full w-96 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-0 transform -translate-x-full bg-nebula-primary/80 hover:bg-nebula-primary text-white p-2 rounded-l-md"
        >
          {isSidebarOpen ? '→' : '←'}
        </button>
        <KnapsackTable className="h-full rounded-none p-6" />
      </div>
      
      <ControlPanel />
      
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="max-w-3xl mx-auto text-center backdrop-blur-sm bg-black/30 py-4 px-6 rounded-lg shadow-lg">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-nebula-primary via-nebula-secondary to-nebula-accent bg-clip-text text-transparent shadow-glow mb-1">
            Otherworldly Knapsack
          </h1>
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-nebula-secondary to-transparent"></div>
            <p className="text-xs md:text-sm text-white font-light tracking-widest uppercase">
              Algorithm Visualization as Art
            </p>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-nebula-secondary to-transparent"></div>
          </div>
          <p className="text-xs md:text-sm text-gray-200 max-w-lg mx-auto">
            Explore the beauty of dynamic programming through an immersive cosmic experience
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
