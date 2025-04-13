import { Suspense, useState, useEffect } from 'react'
import Scene from './components/layout/Scene'
import Interface from './components/layout/Interface'
import { Canvas } from '@react-three/fiber'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[var(--tertiary)]">
            Knapsack Simulator
          </h1>
          <p className="text-[var(--secondary)]">Loading the visualization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <Interface />
    </div>
  )
}

export default App
