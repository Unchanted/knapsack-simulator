import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import anime from 'animejs'

const KnapsackTable = ({ 
  table, 
  itemsTable, 
  items, 
  currentCell,
  algorithmComplete,
  showIntermediates,
  showAnimation,
  highlighted = [] // Add default empty array for highlighted cells
}) => {
  const [hoveredCell, setHoveredCell] = useState(null)
  const [tableSizes, setTableSizes] = useState({ width: 0, height: 0 })
  const [error, setError] = useState(null)
  const tableRef = useRef(null)
  const cellRefs = useRef({})
  
  useEffect(() => {
    if (table && table.length > 0) {
      setTableSizes({
        height: table.length,
        width: table[0].length
      })
      setError(null)
    } else {
      setTableSizes({ width: 0, height: 0 })
    }
  }, [table])

  // Initialize cell refs
  const getCellRef = (i, j) => {
    const key = `${i}-${j}`
    if (!cellRefs.current[key]) {
      cellRefs.current[key] = React.createRef()
    }
    return cellRefs.current[key]
  }
  
  // Apply animations when currentRow or currentCol changes
  useEffect(() => {
    if (!showAnimation || !currentCell || currentCell.row === null || currentCell.col === null) return
    
    // Current cell highlight animation
    const currentCellRef = cellRefs.current[`${currentCell.row}-${currentCell.col}`]?.current
    if (currentCellRef) {
      anime({
        targets: currentCellRef,
        backgroundColor: ['rgba(252, 211, 77, 0.8)', 'rgba(252, 211, 77, 0.4)'],
        scale: [1.1, 1],
        duration: 800,
        easing: 'easeOutQuad'
      })
    }
    
    // Animate the row indicator
    const rowIndicator = document.getElementById(`row-${currentCell.row}`)
    if (rowIndicator) {
      anime({
        targets: rowIndicator,
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.4)'],
        scale: [1.1, 1],
        duration: 600,
        easing: 'easeOutQuad'
      })
    }
    
    // Animate the column indicator
    const colIndicator = document.getElementById(`col-${currentCell.col}`)
    if (colIndicator) {
      anime({
        targets: colIndicator,
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.4)'],
        scale: [1.1, 1],
        duration: 600,
        easing: 'easeOutQuad'
      })
    }
  }, [currentCell, showAnimation])
  
  // Animate highlighted cells
  useEffect(() => {
    if (!showAnimation || !highlighted || highlighted.length === 0) return
    
    highlighted.forEach(([i, j]) => {
      const cell = cellRefs.current[`${i}-${j}`]?.current
      if (cell) {
        anime({
          targets: cell,
          backgroundColor: ['rgba(167, 139, 250, 0.8)', 'rgba(167, 139, 250, 0.4)'],
          scale: [1.05, 1],
          duration: 600,
          easing: 'easeOutQuad'
        })
      }
    })
  }, [highlighted, showAnimation])
  
  // Animation for table load
  useEffect(() => {
    if (!tableRef.current || !showAnimation) return
    
    // Initial animation for the table
    anime({
      targets: tableRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: 'easeOutQuad'
    })
    
    // Staggered animation for cells
    anime({
      targets: '.table-cell',
      opacity: [0, 1],
      scale: [0.9, 1],
      delay: anime.stagger(10, { grid: [table[0]?.length || 0, table.length || 0], from: 'center' }),
      duration: 600,
      easing: 'easeOutQuad'
    })
  }, [table, showAnimation])

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg p-4">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    )
  }

  if (!table || table.length === 0 || !table[0] || !table[0].length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg p-4">
        <p className="text-gray-400 text-lg">Table will appear here once the algorithm starts</p>
      </div>
    )
  }

  // Helper function to get cell background color based on state
  const getCellBackground = (row, col, value) => {
    if (currentCell && currentCell.row === row && currentCell.col === col) {
      return 'bg-yellow-500 text-black'
    }
    
    if (algorithmComplete && row === table.length - 1 && col === table[0].length - 1) {
      return 'bg-green-600'
    }
    
    // Check if this cell contains an item
    if (itemsTable && itemsTable[row] && itemsTable[row][col] && itemsTable[row][col].length > 0) {
      return 'bg-blue-700'
    }
    
    return value > 0 ? 'bg-primary bg-opacity-70' : 'bg-gray-700'
  }

  // Cell component with item details popup
  const TableCell = ({ row, col, value, isHeader, itemsAtCell }) => {
    const isCurrentCell = currentCell && currentCell.row === row && currentCell.col === col
    const hasItems = itemsAtCell && itemsAtCell.length > 0
    const cellRef = getCellRef(row, col) // Use the getCellRef function to get a ref for this cell
    
    return (
      <div 
        ref={cellRef}
        className={`
          table-cell relative flex items-center justify-center p-2 border border-gray-700
          ${isHeader ? 'bg-gray-800 font-medium' : getCellBackground(row, col, value)}
          ${isCurrentCell ? 'ring-2 ring-yellow-300' : ''}
          ${hasItems && !isHeader ? 'cursor-pointer' : ''}
          transition-colors duration-200
        `}
        onMouseEnter={() => hasItems && setHoveredCell({ row, col })}
        onMouseLeave={() => setHoveredCell(null)}
      >
        <span>{value !== undefined ? value : (row === 0 ? col : `Item ${row}`)}</span>
        
        {/* Item indicator */}
        {hasItems && !isHeader && (
          <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
        )}
        
        {/* Animated highlight for current cell */}
        {isCurrentCell && (
          <motion.div 
            className="absolute inset-0 bg-yellow-300 bg-opacity-30 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
          />
        )}
      </div>
    )
  }

  // Popup for showing items in cell
  const ItemsPopup = ({ items, cellItems, position }) => {
    if (!cellItems || cellItems.length === 0) return null

    const selectedItemIndices = cellItems.map(item => item.index)
    
    return (
      <AnimatePresence>
        {hoveredCell && (
          <motion.div 
            className="absolute z-50 bg-gray-800 rounded-lg shadow-xl border border-gray-600 p-3 w-64"
            style={{
              top: `${position.row * 40 + 20}px`,
              left: `${position.col * 40 + 40}px`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="text-gray-300 font-medium mb-2">Items in cell ({cellItems.length})</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedItemIndices.map((itemIndex) => {
                const item = items && items[itemIndex - 1]  // Adjust for 0-indexing
                if (!item) return null
                return (
                  <div key={itemIndex} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-blue-500`}></div>
                      <span>Item {itemIndex}</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      <span>W: {item.weight}, V: {item.value}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Function to display intermediate calculation details
  const IntermediateCalculation = () => {
    if (!showIntermediates || !currentCell || !table) return null
    
    const { row, col } = currentCell
    if (row === 0 || col === 0 || !table[row] || !table[row][col]) return null
    
    const currentItemIndex = row
    const currentItem = items && items[currentItemIndex - 1]
    if (!currentItem) return null
    
    const currentWeight = col
    
    // Safe access to avoid errors
    const currentValue = table && table[row] && table[row][col] !== undefined ? table[row][col] : 0
    const prevRowValue = table && table[row-1] && table[row-1][col] !== undefined ? table[row-1][col] : 0
    const valueWithoutItem = prevRowValue
    
    let valueWithItem = 0
    if (currentItem && currentItem.weight <= currentWeight && 
        table[row-1] && table[row-1][currentWeight - currentItem.weight] !== undefined) {
      valueWithItem = table[row-1][currentWeight - currentItem.weight] + currentItem.value
    }
    
    const betterValue = Math.max(valueWithItem, valueWithoutItem)

    return (
      <motion.div 
        className="bg-gray-800 rounded-lg p-4 mt-4 border border-gray-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-medium text-gray-300 mb-3">Current Calculation:</h3>
        <div className="space-y-2 text-sm">
          <p className="text-gray-400">Considering Item {currentItemIndex} (Weight: {currentItem?.weight}, Value: {currentItem?.value})</p>
          <p className="text-gray-400">Current knapsack capacity: {currentWeight}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="bg-gray-700 p-3 rounded-lg">
              <h4 className="font-medium text-gray-300 mb-1">Without Item {currentItemIndex}:</h4>
              <p className="text-gray-400">Value = {valueWithoutItem}</p>
            </div>
            
            <div className="bg-gray-700 p-3 rounded-lg">
              <h4 className="font-medium text-gray-300 mb-1">With Item {currentItemIndex}:</h4>
              {currentItem && currentItem.weight <= currentWeight ? (
                <>
                  <p className="text-gray-400">Value = {table[row-1] && table[row-1][currentWeight - currentItem.weight]} + {currentItem.value} = {valueWithItem}</p>
                </>
              ) : (
                <p className="text-gray-400">Item doesn't fit (weight {currentItem?.weight} &gt; capacity {currentWeight})</p>
              )}
            </div>
          </div>
          
          <div className="bg-primary bg-opacity-20 p-3 rounded-lg mt-3">
            <p className="font-medium">Best value: {betterValue} ({betterValue === valueWithItem ? 'taking' : 'not taking'} item)</p>
          </div>
        </div>
      </motion.div>
    )
  }

  // Safely render the table
  const renderTable = () => {
    try {
      // Ensure we have valid data to render
      if (!table || !Array.isArray(table) || table.length === 0 || !table[0] || !Array.isArray(table[0])) {
        return (
          <div className="text-gray-400 text-center p-4">
            No data available for table rendering
          </div>
        )
      }
      
      return (
        <div className="grid" style={{ 
          gridTemplateColumns: `auto repeat(${tableSizes.width - 1}, minmax(40px, 1fr))`,
          maxWidth: '100%'
        }}>
          {/* Generate header row */}
          {Array.from({ length: tableSizes.width }).map((_, colIndex) => (
            <TableCell 
              key={`header-${colIndex}`} 
              value={colIndex === 0 ? "W/I" : colIndex - 1} 
              isHeader={true} 
              row={0} 
              col={colIndex}
            />
          ))}
          
          {/* Generate table rows - with safety checks */}
          {table && Array.from({ length: tableSizes.height - 1 }).map((_, rowIndex) => {
            // Ensure this row exists in the table
            if (!table[rowIndex + 1]) return null
            
            return (
              <React.Fragment key={`row-${rowIndex + 1}`}>
                {Array.from({ length: tableSizes.width }).map((_, colIndex) => {
                  // Safe access to table cell value
                  const cellValue = colIndex === 0 
                    ? rowIndex + 1 
                    : (table[rowIndex + 1] && colIndex < table[rowIndex + 1].length 
                        ? table[rowIndex + 1][colIndex] 
                        : '?')
                  
                  return (
                    <TableCell 
                      key={`cell-${rowIndex + 1}-${colIndex}`}
                      value={cellValue}
                      row={rowIndex + 1}
                      col={colIndex}
                      itemsAtCell={itemsTable && itemsTable[rowIndex + 1] && 
                                  colIndex < (itemsTable[rowIndex + 1]?.length || 0) 
                                    ? itemsTable[rowIndex + 1][colIndex] 
                                    : []}
                    />
                  )
                })}
              </React.Fragment>
            )
          })}
        </div>
      )
    } catch (err) {
      setError(`Error rendering table: ${err.message}`)
      return (
        <div className="text-red-400 text-center p-4">
          Error rendering table. Please check console for details.
        </div>
      )
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-5 overflow-x-auto" ref={tableRef}>
      <h2 className="text-lg font-medium text-gray-300 mb-4">Dynamic Programming Table</h2>
      
      <div className="relative overflow-x-auto">
        {renderTable()}
        
        {/* Popup for showing items */}
        {hoveredCell && itemsTable && itemsTable[hoveredCell.row] && itemsTable[hoveredCell.row][hoveredCell.col] && (
          <ItemsPopup 
            items={items}
            cellItems={itemsTable[hoveredCell.row][hoveredCell.col]}
            position={hoveredCell}
          />
        )}
      </div>
      
      {/* Show intermediate calculations if enabled */}
      {showIntermediates && <IntermediateCalculation />}
    </div>
  )
}

export default KnapsackTable