import { useState, useEffect, useRef, useCallback } from 'react'
import anime from 'animejs'
import KnapsackTable from './KnapsackTable'
import ItemsList from './ItemsList'
import KnapsackSack from './KnapsackSack'
import KnapsackForm from './KnapsackForm'
import KnapsackControls from './KnapsackControls'

const KnapsackVisualizer = () => {
  // State for items
  const [items, setItems] = useState([
    { id: 1, name: "Item 1", value: 60, weight: 10, isSelected: false },
    { id: 2, name: "Item 2", value: 100, weight: 20, isSelected: false },
    { id: 3, name: "Item 3", value: 120, weight: 30, isSelected: false },
    { id: 4, name: "Item 4", value: 80, weight: 15, isSelected: false },
    { id: 5, name: "Item 5", value: 200, weight: 40, isSelected: false },
  ])
  
  // State for capacity
  const [capacity, setCapacity] = useState(50)
  
  // State for DP table
  const [dpTable, setDpTable] = useState([])
  const [itemsTable, setItemsTable] = useState([])
  
  // State for selected items
  const [selectedItems, setSelectedItems] = useState([])
  
  // State for animation control
  const [animationSpeed, setAnimationSpeed] = useState(500) // ms
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [animationSteps, setAnimationSteps] = useState([])
  
  // Refs for animation
  const mainContainerRef = useRef(null)
  const tableContainerRef = useRef(null)
  const visualizationContainerRef = useRef(null)
  const controlsContainerRef = useRef(null)
  const itemsContainerRef = useRef(null)
  const explanationRef = useRef(null)
  
  // State for UI
  const [viewMode, setViewMode] = useState('standard') // standard, table-focus, visual-focus
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Additional state for KnapsackControls
  const [isRunning, setIsRunning] = useState(false)
  const [autoRun, setAutoRun] = useState(false)
  const [showIntermediates, setShowIntermediates] = useState(true)
  const [totalValue, setTotalValue] = useState(0)
  const [totalWeight, setTotalWeight] = useState(0)
  const [algorithmComplete, setAlgorithmComplete] = useState(false)
  const [currentCell, setCurrentCell] = useState({ row: null, col: null })
  
  // Initialize animations
  useEffect(() => {
    try {
      // Make sure the refs exist before animating
      if (!mainContainerRef.current) {
        return;
      }
      
      // Initial page load animation sequence
      anime.timeline({
        easing: 'easeOutQuad'
      })
      .add({
        targets: mainContainerRef.current,
        opacity: [0, 1],
        duration: 600
      })
      
      // Only animate these elements if they exist
      const targetElements = [
        mainContainerRef.current
      ].filter(Boolean);
      
      if (targetElements.length > 0) {
        anime({
          targets: targetElements,
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 800,
          easing: 'easeOutCubic'
        });
      }
    } catch (err) {
      console.error("Animation error:", err);
    }
  }, [])
  
  // Initialize DP table
  useEffect(() => {
    try {
      initializeDPTable()
    } catch (err) {
      console.error("Error initializing DP table:", err)
      setError(`Failed to initialize: ${err.message}`)
    }
  }, [items, capacity])
  
  const initializeDPTable = () => {
    setLoading(true)
    setError(null)
    
    try {
      const n = items.length
      const w = capacity
      
      if (n <= 0 || w <= 0) {
        setDpTable([])
        setItemsTable([])
        setSelectedItems([])
        setLoading(false)
        return
      }
      
      // Create empty table with n+1 rows and w+1 columns
      const table = Array(n + 1).fill().map(() => Array(w + 1).fill(0))
      const includedItems = Array(n + 1).fill().map(() => Array(w + 1).fill().map(() => []))
      
      setDpTable(table)
      setItemsTable(includedItems)
      setCurrentCell(null)
      
      // Reset animation steps
      setAnimationSteps([{ 
        table: JSON.parse(JSON.stringify(table)), 
        currentCell: null,
        selectedItems: [],
        explanation: "Initial DP table with all values set to 0"
      }])
      
      setTotalSteps((n + 1) * (w + 1) + 1) // +1 for the final traceback
      setCurrentStep(0)
      setIsPlaying(false)
      setSelectedItems([])
      setTotalValue(0)
      setTotalWeight(0)
      setAlgorithmComplete(false)
      setLoading(false)
    } catch (err) {
      console.error("Error in initializeDPTable:", err)
      setError(`Initialization error: ${err.message}`)
      setLoading(false)
    }
  }
  
  // Safe update function for tables
  const safelyUpdateTable = (newTable) => {
    if (!newTable || !Array.isArray(newTable)) {
      console.error("Invalid table data:", newTable)
      return
    }
    setDpTable(newTable)
  }
  
  // Safe update function for items table
  const safelyUpdateItemsTable = (newItemsTable) => {
    if (!newItemsTable || !Array.isArray(newItemsTable)) {
      console.error("Invalid items table data:", newItemsTable)
      return
    }
    setItemsTable(newItemsTable)
  }
  
  // Solve knapsack using dynamic programming
  const solveKnapsack = async () => {
    setIsPlaying(true)
    setCurrentStep(0)
    
    const n = items.length
    const w = capacity
    const steps = []
    
    // Create a deep copy of the initial table
    const table = JSON.parse(JSON.stringify(dpTable))
    const included = JSON.parse(JSON.stringify(itemsTable))
    
    // Base case is already handled (initialized with zeros)
    steps.push({ 
      table: JSON.parse(JSON.stringify(table)), 
      currentCell: null,
      selectedItems: [],
      explanation: "Initial DP table with all values set to 0"
    })
    
    // Fill the DP table
    for (let i = 1; i <= n; i++) {
      const currentItem = items[i - 1]
      
      // Row explanation
      steps.push({
        table: JSON.parse(JSON.stringify(table)),
        currentCell: { row: i, col: 0 },
        currentItem: currentItem,
        selectedItems: [],
        explanation: `Now processing item ${currentItem.name} (value: ${currentItem.value}, weight: ${currentItem.weight})`
      })
      
      // Wait for animation
      if (isPlaying) {
        await new Promise(resolve => setTimeout(resolve, animationSpeed * 1.5))
      }
      
      for (let j = 0; j <= w; j++) {
        // If item weight is greater than current capacity
        if (currentItem.weight > j) {
          table[i][j] = table[i - 1][j]
          included[i][j] = []
          steps.push({
            table: JSON.parse(JSON.stringify(table)),
            currentCell: { row: i, col: j },
            currentItem: currentItem,
            selectedItems: [],
            explanation: `Item ${currentItem.name} (weight: ${currentItem.weight}) is too heavy for capacity ${j}, so we take the value from above (${table[i][j]})`
          })
        } else {
          // Max of (value of current item + value of remaining capacity, value without current item)
          const valueWithItem = currentItem.value + table[i - 1][j - currentItem.weight]
          const valueWithoutItem = table[i - 1][j]
          
          table[i][j] = Math.max(valueWithItem, valueWithoutItem)
          
          if (valueWithItem > valueWithoutItem) {
            included[i][j] = [...(included[i - 1][j - currentItem.weight] || []), { index: i, ...currentItem }]
          } else {
            included[i][j] = []
          }
          
          steps.push({
            table: JSON.parse(JSON.stringify(table)),
            currentCell: { row: i, col: j },
            currentItem: currentItem,
            selectedItems: [],
            explanation: valueWithItem > valueWithoutItem 
              ? `Taking item ${currentItem.name} gives better value (${valueWithItem} > ${valueWithoutItem}), so we set cell to ${table[i][j]}`
              : `Not taking item ${currentItem.name} gives better value (${valueWithoutItem} >= ${valueWithItem}), so we set cell to ${table[i][j]}`
          })
        }
        
        if (isPlaying) {
          // Wait for animation
          await new Promise(resolve => setTimeout(resolve, animationSpeed))
        }
      }
    }
    
    // Highlight final cell
    steps.push({
      table: JSON.parse(JSON.stringify(table)),
      currentCell: { row: n, col: w },
      selectedItems: [],
      explanation: `Optimal solution found: Maximum value is ${table[n][w]}`
    })
    
    // Wait for animation
    if (isPlaying) {
      await new Promise(resolve => setTimeout(resolve, animationSpeed * 2))
    }
    
    // Traceback to find selected items
    let remainingCapacity = w
    const selected = []
    
    // Animation for traceback
    steps.push({
      table: JSON.parse(JSON.stringify(table)),
      currentCell: { row: n, col: w },
      selectedItems: [],
      explanation: "Starting traceback to identify selected items..."
    })
    
    // Wait for animation
    if (isPlaying) {
      await new Promise(resolve => setTimeout(resolve, animationSpeed * 1.5))
    }
    
    for (let i = n; i > 0; i--) {
      steps.push({
        table: JSON.parse(JSON.stringify(table)),
        currentCell: { row: i, col: remainingCapacity },
        selectedItems: [...selected],
        explanation: `Checking if item ${items[i-1].name} is part of the solution...`
      })
      
      // Wait for animation
      if (isPlaying) {
        await new Promise(resolve => setTimeout(resolve, animationSpeed))
      }
      
      // If this item was included
      if (included[i][remainingCapacity].length > 0) {
        const selectedItem = { ...items[i-1], isSelected: true }
        selected.unshift(selectedItem)
        remainingCapacity -= items[i-1].weight
        
        steps.push({
          table: JSON.parse(JSON.stringify(table)),
          currentCell: { row: i, col: remainingCapacity },
          selectedItems: [...selected],
          explanation: `Item ${selectedItem.name} is included in the optimal solution!`
        })
        
        // Wait for animation
        if (isPlaying) {
          await new Promise(resolve => setTimeout(resolve, animationSpeed))
        }
      } else {
        steps.push({
          table: JSON.parse(JSON.stringify(table)),
          currentCell: { row: i-1, col: remainingCapacity },
          selectedItems: [...selected],
          explanation: `Item ${items[i-1].name} is NOT included in the optimal solution.`
        })
        
        // Wait for animation
        if (isPlaying) {
          await new Promise(resolve => setTimeout(resolve, animationSpeed))
        }
      }
    }
    
    // Final step
    steps.push({
      table: JSON.parse(JSON.stringify(table)),
      currentCell: null,
      selectedItems: selected,
      explanation: `Optimal solution found with total value: ${table[n][w]}. Selected items: ${selected.map(i => i.name).join(', ')}`
    })
    
    setAnimationSteps(steps)
    setTotalSteps(steps.length)
    setSelectedItems(selected)
    setTotalValue(table[n][w])
    setTotalWeight(selected.reduce((sum, item) => sum + item.weight, 0))
    setAlgorithmComplete(true)
    setCurrentCell(null)
    return steps
  }
  
  const startAnimation = async () => {
    if (animationSteps.length <= 1) {
      const steps = await solveKnapsack()
      setAnimationSteps(steps)
    } else {
      setIsPlaying(true)
    }
    
    // If we're starting, switch to a better view mode for animation
    if (currentStep === 0) {
      setViewMode('standard')
    }
    
    for (let i = currentStep; i < animationSteps.length; i++) {
      if (!isPlaying) break
      
      setCurrentStep(i)
      setDpTable(animationSteps[i].table)
      setItemsTable(animationSteps[i].selectedItems.map(item => items.map(i => i.id === item.id ? { ...i, isSelected: true } : i).map(i => i.isSelected ? 1 : 0)))
      
      if (animationSteps[i].selectedItems.length > 0) {
        setSelectedItems(animationSteps[i].selectedItems)
      }
      
      // Animate explanation text
      if (explanationRef.current) {
        anime({
          targets: explanationRef.current,
          opacity: [0.5, 1],
          translateY: [5, 0],
          duration: animationSpeed * 0.5,
          easing: 'easeOutQuad'
        })
      }
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, animationSpeed))
    }
    
    setIsPlaying(false)
  }
  
  const pauseAnimation = () => {
    setIsPlaying(false)
  }
  
  const resetAnimation = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    initializeDPTable()
  }
  
  const stepForward = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      
      if (animationSteps[nextStep]) {
        setDpTable(animationSteps[nextStep].table)
        setItemsTable(animationSteps[nextStep].selectedItems.map(item => items.map(i => i.id === item.id ? { ...i, isSelected: true } : i).map(i => i.isSelected ? 1 : 0)))
        
        if (animationSteps[nextStep].selectedItems.length > 0) {
          setSelectedItems(animationSteps[nextStep].selectedItems)
        }
        
        // Animate explanation text
        if (explanationRef.current) {
          anime({
            targets: explanationRef.current,
            opacity: [0.5, 1],
            translateY: [5, 0],
            duration: 300,
            easing: 'easeOutQuad'
          })
        }
      }
    }
  }
  
  const stepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      
      if (animationSteps[prevStep]) {
        setDpTable(animationSteps[prevStep].table)
        setItemsTable(animationSteps[prevStep].selectedItems.map(item => items.map(i => i.id === item.id ? { ...i, isSelected: true } : i).map(i => i.isSelected ? 1 : 0)))
        
        if (animationSteps[prevStep].selectedItems.length > 0) {
          setSelectedItems(animationSteps[prevStep].selectedItems)
        } else {
          setSelectedItems([])
        }
        
        // Animate explanation text
        if (explanationRef.current) {
          anime({
            targets: explanationRef.current,
            opacity: [0.5, 1],
            translateY: [5, 0],
            duration: 300,
            easing: 'easeOutQuad'
          })
        }
      }
    }
  }
  
  const addNewItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    const newItem = { 
      id: newId, 
      name: `Item ${newId}`, 
      value: Math.floor(Math.random() * 100) + 50, 
      weight: Math.floor(Math.random() * 20) + 5,
      isSelected: false
    }
    setItems([...items, newItem])
  }
  
  const updateItem = (id, field, value) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    )
    setItems(updatedItems)
  }
  
  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }
  
  const updateCapacity = (newCapacity) => {
    setCapacity(parseInt(newCapacity))
  }
  
  const updateAnimationSpeed = (speed) => {
    setAnimationSpeed(1000 - speed) // Invert so higher = faster
  }
  
  // Toggle view modes
  const toggleViewMode = (mode) => {
    setViewMode(mode)
  }
  
  // Calculate knapsack table
  const calculateKnapsackTable = () => {
    const n = items.length
    const w = capacity
    
    // Initialize 2D array with zeros
    const dp = Array(n + 1).fill().map(() => Array(w + 1).fill(0))
    const included = Array(n + 1).fill().map(() => Array(w + 1).fill().map(() => []))
    
    setDpTable(dp)
    setItemsTable(included)
    setCurrentCell(null)
    setSelectedItems([])
    setTotalValue(0)
    setTotalWeight(0)
    setAlgorithmComplete(false)
    
    return { dp, included }
  }

  // Solve the knapsack problem step by step
  const solveKnapsackStep = useCallback((step) => {
    try {
      if (!items.length) return false
      
      const n = items.length
      const w = capacity
      
      // Check if dpTable is properly initialized
      if (!dpTable || !Array.isArray(dpTable) || dpTable.length === 0) {
        console.error("DP table not properly initialized")
        return false
      }
      
      // Get current copies of dp and included tables
      const dp = JSON.parse(JSON.stringify(dpTable))
      const included = JSON.parse(JSON.stringify(itemsTable))
      
      // Extract row and column from step
      const i = Math.floor(step / (w + 1)) + 1
      const j = step % (w + 1)
      
      // Check if we've gone beyond the last step
      if (i > n) {
        setAlgorithmComplete(true)
        
        // Extract the selected items
        const selected = []
        let currentWeight = w
        let currentValue = 0
        
        for (let itemIndex = n; itemIndex > 0; itemIndex--) {
          if (currentWeight >= 0 && included[itemIndex] && included[itemIndex][currentWeight] && included[itemIndex][currentWeight].length > 0) {
            const item = items[itemIndex - 1]
            if (item) {
              selected.unshift({...item, isSelected: true})
              currentValue += item.value
              currentWeight -= item.weight
            }
          }
        }
        
        setSelectedItems(selected)
        setTotalValue(dp[n][w])
        setTotalWeight(selected.reduce((sum, item) => sum + item.weight, 0))
        setCurrentCell(null)
        return false
      }
      
      // Ensure indices are valid
      if (i <= 0 || i >= dp.length || j < 0 || !dp[i] || j >= dp[i].length) {
        console.error(`Invalid indices: i=${i}, j=${j}, dp.length=${dp.length}, dp[i]?.length=${dp[i]?.length}`)
        return false
      }
      
      // Set current cell for animation
      setCurrentCell({ row: i, col: j })
      
      // Skip steps where j < item's weight for the first row
      if (i === 1 && j < items[0].weight) {
        dp[i][j] = 0
        included[i][j] = []
        safelyUpdateTable(dp)
        safelyUpdateItemsTable(included)
        return true
      }
      
      // Update the table
      if (i > 0 && j >= 0) {
        const currentItem = items[i - 1]
        
        if (j < currentItem.weight) {
          // If current item doesn't fit, take value from above
          dp[i][j] = dp[i - 1][j]
          included[i][j] = []
        } else {
          // Choose maximum of including or excluding current item
          const includeItem = dp[i - 1][j - currentItem.weight] + currentItem.value
          const excludeItem = dp[i - 1][j]
          
          if (includeItem > excludeItem) {
            dp[i][j] = includeItem
            included[i][j] = [...(included[i - 1][j - currentItem.weight] || []), { index: i, ...currentItem }]
          } else {
            dp[i][j] = excludeItem
            included[i][j] = []
          }
        }
        
        safelyUpdateTable(dp)
        safelyUpdateItemsTable(included)
        return true
      }
      
      return false
    } catch (err) {
      console.error("Error in solveKnapsackStep:", err)
      setError(`Algorithm step error: ${err.message}`)
      return false
    }
  }, [items, capacity, dpTable, itemsTable])

  // Initialize the algorithm
  const initializeAlgorithm = () => {
    try {
      setIsRunning(true)
      setError(null)
      
      const { dp, included } = calculateKnapsackTable()
      if (dp.length === 0) {
        setError("Failed to initialize the algorithm")
        setIsRunning(false)
        return
      }
      
      setTimeout(() => runAlgorithm(0), 100)
    } catch (err) {
      console.error("Error in initializeAlgorithm:", err)
      setError(`Algorithm initialization failed: ${err.message}`)
      setIsRunning(false)
    }
  }

  // Run algorithm steps
  const runAlgorithm = (step) => {
    try {
      const hasMoreSteps = solveKnapsackStep(step)
      
      if (hasMoreSteps && (autoRun || step === 0)) {
        setTimeout(() => runAlgorithm(step + 1), animationSpeed)
      } else if (!hasMoreSteps) {
        setIsRunning(false)
      } else {
        setIsRunning(false)
      }
    } catch (err) {
      console.error("Error in runAlgorithm:", err)
      setError(`Algorithm execution error: ${err.message}`)
      setIsRunning(false)
    }
  }

  // Continue the algorithm after pausing
  const continueAlgorithm = () => {
    try {
      if (currentCell && currentCell.row !== null && currentCell.col !== null) {
        const currentStep = currentCell.row * (capacity + 1) + currentCell.col
        setIsRunning(true)
        runAlgorithm(currentStep + 1)
      } else {
        // If no current cell, restart from beginning
        initializeAlgorithm()
      }
    } catch (err) {
      console.error("Error in continueAlgorithm:", err)
      setError(`Failed to continue algorithm: ${err.message}`)
    }
  }

  // Step through the algorithm manually
  const stepAlgorithm = () => {
    try {
      if (!isRunning) {
        if (dpTable.length === 0) {
          initializeAlgorithm()
        } else if (currentCell && currentCell.row !== null && currentCell.col !== null) {
          const currentStep = currentCell.row * (capacity + 1) + currentCell.col
          solveKnapsackStep(currentStep + 1)
        } else {
          // If algorithm completed or not started, restart
          initializeAlgorithm()
        }
      }
    } catch (err) {
      console.error("Error in stepAlgorithm:", err)
      setError(`Failed to step algorithm: ${err.message}`)
    }
  }
  
  // Handle form submission for setting items and capacity
  const handleFormSubmit = (formItems, formCapacity) => {
    try {
      if (!Array.isArray(formItems) || typeof formCapacity !== 'number') {
        throw new Error("Invalid form data")
      }
      
      setItems(formItems)
      setCapacity(formCapacity)
      setDpTable([])
      setItemsTable([])
      setSelectedItems([])
      setCurrentCell({ row: null, col: null })
      setIsRunning(false)
      setAlgorithmComplete(false)
      setTotalValue(0)
      setTotalWeight(0)
      
      // Reset animation states
      setAnimationSteps([])
      setCurrentStep(0)
      setTotalSteps(0)
    } catch (err) {
      console.error("Error in handleFormSubmit:", err)
      setError(`Failed to update configuration: ${err.message}`)
    }
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
          <h2 className="text-lg font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => setError(null)} 
            className="mt-2 bg-white text-red-600 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Dismiss
          </button>
        </div>
        
        <KnapsackForm 
          onSubmit={handleFormSubmit}
          initialItems={items}
          initialCapacity={capacity}
        />
      </div>
    )
  }
  
  return (
    <div ref={mainContainerRef} className="flex flex-col gap-5 max-w-6xl mx-auto">
      {/* Problem Configuration Form */}
      <div className="mb-2">
        <KnapsackForm 
          onSubmit={handleFormSubmit}
          initialItems={items}
          initialCapacity={capacity}
        />
      </div>
    
      {/* View mode toggles */}
      <div className="flex justify-center pb-2">
        <div className="inline-flex bg-gray-800 p-1 rounded-lg">
          <button 
            onClick={() => toggleViewMode('table-focus')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === 'table-focus' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Table Focus
          </button>
          <button 
            onClick={() => toggleViewMode('standard')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === 'standard' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Standard View
          </button>
          <button 
            onClick={() => toggleViewMode('visual-focus')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === 'visual-focus' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Visual Focus
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="ml-4 text-gray-300">Loading...</p>
        </div>
      ) : (
        <div className={`grid gap-5 ${
          viewMode === 'standard' ? 'grid-cols-1 lg:grid-cols-3' : 
          viewMode === 'table-focus' ? 'grid-cols-1 lg:grid-cols-3' : 
          'grid-cols-1 lg:grid-cols-2'
        }`}>
          {/* Items panel */}
          <div className={`bg-gray-800 rounded-lg p-4 shadow-lg ${
            viewMode === 'visual-focus' ? 'order-2 lg:col-span-1' : 
            viewMode === 'table-focus' ? 'order-3 lg:col-span-1' : 
            'lg:col-span-1'
          }`}>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"></path>
                <path d="M12 12v9"></path>
                <path d="M8 12v9"></path>
                <path d="M16 12v9"></path>
                <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"></path>
              </svg>
              Items
            </h2>
            <ItemsList 
              items={items} 
              updateItem={(id, field, value) => {
                const updatedItems = items.map(item => 
                  item.id === id ? { ...item, [field]: field === 'name' ? value : Number(value) } : item
                )
                setItems(updatedItems)
              }}
              removeItem={(id) => {
                setItems(items.filter(item => item.id !== id))
              }}
              addNewItem={() => {
                const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
                setItems([...items, { 
                  id: newId, 
                  name: `Item ${newId}`, 
                  value: Math.floor(Math.random() * 100) + 50, 
                  weight: Math.floor(Math.random() * 20) + 5,
                  isSelected: false
                }])
              }}
              selectedItems={selectedItems}
            />
          </div>
          
          {/* Table visualization */}
          <div className={`bg-gray-800 rounded-lg p-4 shadow-lg ${
            viewMode === 'table-focus' ? 'order-1 lg:col-span-2' : 
            viewMode === 'visual-focus' ? 'order-3 lg:col-span-2' : 
            'lg:col-span-2'
          }`}>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h18v18H3zM3 9h18M9 21V3M15 21V3"></path>
              </svg>
              Dynamic Programming Table
            </h2>
            <KnapsackTable 
              table={dpTable} 
              itemsTable={itemsTable}
              items={items} 
              currentCell={currentCell}
              algorithmComplete={algorithmComplete}
              showIntermediates={showIntermediates}
              showAnimation={true}
            />
            
            {/* Controls */}
            <div className="mt-4">
              <KnapsackControls 
                onStart={initializeAlgorithm}
                onContinue={continueAlgorithm}
                onStep={stepAlgorithm}
                isRunning={isRunning}
                autoRun={autoRun}
                setAutoRun={setAutoRun}
                speed={animationSpeed}
                setSpeed={setAnimationSpeed}
                showIntermediates={showIntermediates}
                setShowIntermediates={setShowIntermediates}
                algorithmComplete={algorithmComplete}
                hasTable={dpTable.length > 0}
              />
            </div>
          </div>
          
          {/* Knapsack Visualization */}
          <div className={`bg-gray-800 rounded-lg p-4 shadow-lg ${
            viewMode === 'visual-focus' ? 'order-1 lg:col-span-1' :
            viewMode === 'table-focus' ? 'order-2 lg:col-span-1' :
            'lg:col-span-1'
          }`}>
            <h2 className="text-xl font-semibold text-primary mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <path d="M7 7h.01"></path>
              </svg>
              Knapsack Visualization
            </h2>
            <KnapsackSack 
              capacity={capacity} 
              selectedItems={selectedItems}
              currentWeight={totalWeight}
              totalValue={totalValue}
            />
            
            {/* Algorithm status */}
            <div className="mt-4 bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-400 text-sm">Status:</span> 
                  <span className={`ml-2 text-sm font-medium ${
                    algorithmComplete ? 'text-green-400' : 
                    isRunning ? 'text-yellow-400' : 'text-gray-300'
                  }`}>
                    {algorithmComplete ? 'Complete' : isRunning ? 'Running' : 'Ready'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Total Value:</span>
                  <span className="ml-2 text-sm font-medium text-yellow-400">{totalValue}</span>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div>
                  <span className="text-gray-400 text-sm">Weight:</span>
                  <span className={`ml-2 text-sm font-medium ${
                    totalWeight > capacity ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {totalWeight} / {capacity}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Items:</span>
                  <span className="ml-2 text-sm font-medium text-blue-400">
                    {selectedItems.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KnapsackVisualizer 