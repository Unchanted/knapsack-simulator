function ControlPanel() {
  return (
    <div className="cosmic-panel w-80">
      <h2 className="text-xl mb-4 text-[var(--secondary)]">Control Panel</h2>
      <div className="grid gap-4">
        <button className="cosmic-button">
          Initialize Algorithm
        </button>
        <div className="flex justify-between items-center">
          <span>Speed</span>
          <input
            type="range"
            min="1"
            max="10"
            defaultValue="5"
            className="w-32"
          />
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
