import ControlPanel from '../ui/ControlPanel'

function Interface() {
  return (
    <div className="interface">
      <div className="absolute top-4 left-4">
        <h1 className="text-2xl font-bold text-[var(--tertiary)]">
          3D Knapsack Simulator
        </h1>
      </div>

      <div className="absolute bottom-4 left-4">
        <ControlPanel />
      </div>
    </div>
  )
}

export default Interface
