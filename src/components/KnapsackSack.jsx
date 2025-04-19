import React, { useRef, useEffect, useState } from 'react'
import anime from 'animejs'

const KnapsackSack = ({ capacity = 0, selectedItems = [], currentWeight = 0, totalValue = 0 }) => {
  // SVG Refs
  const svgRef = useRef(null)
  const sackRef = useRef(null)
  const fillRef = useRef(null)
  const itemsContainerRef = useRef(null)
  const legendRef = useRef(null)
  const ropeRef = useRef(null)
  const handleRef = useRef(null)
  
  // Size constants for visualization
  const [size, setSize] = useState({
    width: 400,
    height: 320
  })
  
  // Error state
  const [error, setError] = useState(null)

  // Set up animations on mount
  useEffect(() => {
    try {
      if (!ropeRef.current || !handleRef.current || !sackRef.current || !legendRef.current) {
        return
      }
      
      // Initial animation for rope and handle
      anime({
        targets: ropeRef.current,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 600,
        easing: 'easeOutQuad'
      })
      
      anime({
        targets: handleRef.current,
        opacity: [0, 1],
        translateY: [-15, 0],
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
      })
      
      // Initial animation for the knapsack
      anime({
        targets: sackRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
      })
      
      // Initial animation for the legend
      anime({
        targets: legendRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: 400,
        easing: 'easeOutQuad'
      })
      
      // Animation for sack breathing effect
      anime({
        targets: sackRef.current,
        scaleY: [1, 1.01, 1],
        duration: 3000,
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate'
      })
    } catch (err) {
      console.error("Error setting up animations:", err)
      setError("Failed to set up animations")
    }
  }, [])
  
  // Update animations when items change
  useEffect(() => {
    try {
      if (!fillRef.current || !itemsContainerRef.current) {
        return
      }
      
      // If there are no items, animate the fill level to 0
      if (!selectedItems || selectedItems.length === 0) {
        anime({
          targets: fillRef.current,
          height: 0,
          duration: 1000,
          easing: 'easeOutQuad'
        })
        return
      }

      // Calculate the height based on current weight as a percentage of capacity
      const fillPercentage = Math.min(100, ((currentWeight || 0) / Math.max(1, capacity)) * 100)
      const fillHeight = (size.height * 0.6) * (fillPercentage / 100)
      
      // Animate the fill level with ripple effect
      anime({
        targets: fillRef.current,
        height: fillHeight,
        duration: 600,
        easing: 'easeOutQuad',
        complete: () => {
          if (fillHeight > 0) {
            // Add a small ripple effect
            anime({
              targets: fillRef.current,
              height: [fillHeight + 5, fillHeight],
              duration: 400,
              easing: 'easeOutElastic(1, .6)'
            })
          }
        }
      })
      
      // Remove old items from the DOM
      while (itemsContainerRef.current.firstChild) {
        itemsContainerRef.current.removeChild(itemsContainerRef.current.firstChild)
      }
      
      // Create and add new items
      if (selectedItems && selectedItems.length > 0 && svgRef.current) {
        selectedItems.forEach((item, index) => {
          if (!item) return
          
          // Calculate value-to-weight ratio to determine item quality (color)
          const ratio = (item.value || 0) / Math.max(1, (item.weight || 1))
          
          // Calculate position and size
          const itemSize = 12 + ((item.weight || 0) / 5) // Size based on weight
          
          try {
            // Create an SVG group for the item
            const itemGroup = document.createElementNS("http://www.w3.org/2000/svg", "g")
            
            // Create shape based on item quality
            const qualityClass = getQualityClass(ratio)
            let itemShape;
            
            switch(qualityClass) {
              case 'legendary':
                // Diamond/gem shape for legendary items
                itemShape = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
                itemShape.setAttribute("points", `0,${-itemSize/2} ${itemSize/2},0 0,${itemSize/2} ${-itemSize/2},0`)
                break;
              case 'epic':
                // Star shape for epic items
                itemShape = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
                const points = []
                for (let i = 0; i < 5; i++) {
                  // Outer points (star points)
                  const outerAngle = (Math.PI * 2 * i / 5) - Math.PI / 2
                  const outerX = Math.cos(outerAngle) * itemSize / 2
                  const outerY = Math.sin(outerAngle) * itemSize / 2
                  points.push(`${outerX},${outerY}`)
                  
                  // Inner points (between star points)
                  const innerAngle = (Math.PI * 2 * (i + 0.5) / 5) - Math.PI / 2
                  const innerX = Math.cos(innerAngle) * itemSize / 4
                  const innerY = Math.sin(innerAngle) * itemSize / 4
                  points.push(`${innerX},${innerY}`)
                }
                itemShape.setAttribute("points", points.join(' '))
                break;
              case 'rare':
                // Triangle for rare items
                itemShape = document.createElementNS("http://www.w3.org/2000/svg", "polygon")
                itemShape.setAttribute("points", `0,${-itemSize/2} ${itemSize/2},${itemSize/2} ${-itemSize/2},${itemSize/2}`)
                break;
              case 'uncommon':
                // Circle for uncommon items
                itemShape = document.createElementNS("http://www.w3.org/2000/svg", "circle")
                itemShape.setAttribute("r", itemSize / 2)
                break;
              default:
                // Square for common items
                itemShape = document.createElementNS("http://www.w3.org/2000/svg", "rect")
                itemShape.setAttribute("width", itemSize)
                itemShape.setAttribute("height", itemSize)
                itemShape.setAttribute("x", -itemSize/2)
                itemShape.setAttribute("y", -itemSize/2)
                itemShape.setAttribute("rx", 2)
            }
            
            // Set common attributes
            itemShape.setAttribute("fill", getColorForRatio(ratio))
            itemShape.setAttribute("class", "filter drop-shadow-md")
            
            // Add glow effect for high-quality items
            if (qualityClass === 'legendary' || qualityClass === 'epic') {
              const defs = svgRef.current.querySelector('defs')
              if (defs) {
                const glow = document.createElementNS("http://www.w3.org/2000/svg", "filter")
                glow.setAttribute("id", `glow-${index}`)
                
                const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur")
                feGaussianBlur.setAttribute("result", "coloredBlur")
                feGaussianBlur.setAttribute("stdDeviation", "2")
                
                const feMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge")
                const feMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode")
                feMergeNode1.setAttribute("in", "coloredBlur")
                const feMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode")
                feMergeNode2.setAttribute("in", "SourceGraphic")
                
                feMerge.appendChild(feMergeNode1)
                feMerge.appendChild(feMergeNode2)
                glow.appendChild(feGaussianBlur)
                glow.appendChild(feMerge)
                
                defs.appendChild(glow)
                itemShape.setAttribute("filter", `url(#glow-${index})`)
              }
            }
            
            // Add to group
            itemGroup.appendChild(itemShape)
            
            // Add text label with item value (for high-value items)
            if (item.value > 100) {
              const itemText = document.createElementNS("http://www.w3.org/2000/svg", "text")
              itemText.setAttribute("text-anchor", "middle")
              itemText.setAttribute("dominant-baseline", "middle")
              itemText.setAttribute("font-size", "8")
              itemText.setAttribute("fill", "white")
              itemText.textContent = item.value
              itemGroup.appendChild(itemText)
            }
            
            // Add to container
            if (itemsContainerRef.current) {
              itemsContainerRef.current.appendChild(itemGroup)
              
              // Animate the new item
              anime({
                targets: itemGroup,
                translateX: [
                  { value: getRandomInt(-50, 50), duration: 0 },
                  { value: getRandomInt(-30, 30), duration: 600 + index * 100 }
                ],
                translateY: [
                  { value: -30, duration: 0 },
                  { value: getRandomInt(-20, 20), duration: 600 + index * 100 }
                ],
                opacity: [0, 1],
                scale: [0.5, 1],
                easing: 'easeOutElastic(1, .5)',
                delay: 100 * index
              })
              
              // Add subtle floating animation to each item
              anime({
                targets: itemGroup,
                translateY: [`+=${getRandomInt(-3, 3)}`, `-=${getRandomInt(-3, 3)}`],
                translateX: [`+=${getRandomInt(-3, 3)}`, `-=${getRandomInt(-3, 3)}`],
                duration: 2000 + getRandomInt(0, 2000),
                direction: 'alternate',
                loop: true,
                easing: 'easeInOutSine'
              })
            }
          } catch (itemErr) {
            console.error("Error creating item:", itemErr)
          }
        })
      }
    } catch (err) {
      console.error("Error updating animations:", err)
      setError("Failed to update animations")
    }
  }, [selectedItems, currentWeight, capacity, size.height])
  
  // Helper function to get color based on value/weight ratio
  const getColorForRatio = (ratio) => {
    // Normalize ratio to a value between 0 and 1
    const normalizedRatio = Math.min(1, ratio / 10)
    
    // Calculate RGB values (red to green gradient)
    const r = Math.floor(255 * (1 - normalizedRatio))
    const g = Math.floor(255 * normalizedRatio)
    const b = Math.floor(100 * normalizedRatio)
    
    return `rgb(${r}, ${g}, ${b})`
  }
  
  // Helper to get quality class
  const getQualityClass = (ratio) => {
    if (ratio >= 7) return 'legendary'
    if (ratio >= 5) return 'epic'
    if (ratio >= 3) return 'rare'
    if (ratio >= 1.5) return 'uncommon'
    return 'common'
  }
  
  // Helper for random positioning
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  
  // Calculate fill percentage
  const fillPercentage = Math.min(100, ((currentWeight || 0) / Math.max(1, capacity)) * 100)
  
  // Update SVG dimensions on window resize
  useEffect(() => {
    try {
      const handleResize = () => {
        const container = svgRef.current?.parentElement
        if (container) {
          const width = Math.min(400, container.clientWidth - 40)
          setSize({
            width: width,
            height: width * 0.8
          })
        }
      }
      
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    } catch (err) {
      console.error("Error handling resize:", err)
    }
  }, [])
  
  if (error) {
    return (
      <div className="bg-red-600 text-white p-4 rounded-lg">
        <p>Error: {error}</p>
      </div>
    )
  }
  
  // Render the knapsack as an SVG
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 flex justify-between items-center w-full">
        <div className="text-sm bg-gray-800 rounded-md p-2 shadow-md">
          <span className="text-gray-400">Weight: </span>
          <span className={`${currentWeight > capacity ? 'text-red-500 font-bold' : 'text-green-400'}`}>
            {currentWeight} / {capacity}
          </span>
        </div>
        <div className="text-sm bg-gray-800 rounded-md p-2 shadow-md">
          <span className="text-gray-400">Value: </span>
          <span className="text-yellow-400 font-semibold">{totalValue}</span>
        </div>
      </div>
      
      <div className="relative w-full flex justify-center">
        <svg 
          ref={svgRef}
          width={size.width} 
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg shadow-inner overflow-visible"
        >
          <defs>
            {/* Fill gradient */}
            <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(130, 220, 255, 0.7)" />
              <stop offset="100%" stopColor="rgba(30, 60, 110, 0.9)" />
            </linearGradient>
            
            {/* Sack texture pattern */}
            <pattern id="sackPattern" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(200, 180, 120, 0.1)" strokeWidth="8" />
            </pattern>
            
            {/* Rope texture */}
            <pattern id="ropePattern" patternUnits="userSpaceOnUse" width="4" height="4">
              <line x1="0" y1="2" x2="4" y2="2" stroke="rgba(150, 120, 90, 0.6)" strokeWidth="3" />
            </pattern>
            
            {/* Light effect for the top opening */}
            <radialGradient id="openingGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </radialGradient>
          </defs>
          
          {/* Rope and handle */}
          <g ref={ropeRef} transform={`translate(${size.width/2}, ${size.height*0.12})`}>
            <path 
              d={`
                M-${size.width*0.15},-${size.height*0.1}
                Q-${size.width*0.05},-${size.height*0.15} 0,-${size.height*0.1}
                Q${size.width*0.05},-${size.height*0.15} ${size.width*0.15},-${size.height*0.1}
              `}
              fill="none"
              stroke="url(#ropePattern)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
          
          <g ref={handleRef} transform={`translate(${size.width/2}, ${size.height*0.05})`}>
            <ellipse
              cx="0"
              cy="0"
              rx={size.width*0.1}
              ry={size.height*0.02}
              fill="#9B7653"
              stroke="#6D4C41"
              strokeWidth="1"
            />
          </g>
          
          {/* Knapsack outline */}
          <g ref={sackRef} transform={`translate(${size.width/2}, ${size.height/2})`}>
            {/* Sack body with texture */}
            <path 
              d={`
                M-${size.width*0.3},${-size.height*0.3}
                C-${size.width*0.3},${-size.height*0.35}
                -${size.width*0.15},${-size.height*0.4}
                0,${-size.height*0.4}
                C${size.width*0.15},${-size.height*0.4}
                ${size.width*0.3},${-size.height*0.35}
                ${size.width*0.3},${-size.height*0.3}
                V${size.height*0.3}
                C${size.width*0.3},${size.height*0.35}
                ${size.width*0.2},${size.height*0.35}
                0,${size.height*0.35}
                C-${size.width*0.2},${size.height*0.35}
                -${size.width*0.3},${size.height*0.35}
                -${size.width*0.3},${size.height*0.3}
                Z
              `}
              fill="url(#sackPattern)"
              stroke="rgba(180, 160, 120, 0.7)"
              strokeWidth="2"
              className="drop-shadow-lg"
            />
            
            {/* Additional texture overlay */}
            <path 
              d={`
                M-${size.width*0.3},${-size.height*0.3}
                C-${size.width*0.3},${-size.height*0.35}
                -${size.width*0.15},${-size.height*0.4}
                0,${-size.height*0.4}
                C${size.width*0.15},${-size.height*0.4}
                ${size.width*0.3},${-size.height*0.35}
                ${size.width*0.3},${-size.height*0.3}
                V${size.height*0.3}
                C${size.width*0.3},${size.height*0.35}
                ${size.width*0.2},${size.height*0.35}
                0,${size.height*0.35}
                C-${size.width*0.2},${size.height*0.35}
                -${size.width*0.3},${size.height*0.35}
                -${size.width*0.3},${size.height*0.3}
                Z
              `}
              fill="rgba(165, 145, 105, 0.5)"
              className="drop-shadow-lg"
            />
            
            {/* Sack opening with glow effect */}
            <ellipse
              cx="0"
              cy={-size.height*0.3}
              rx={size.width*0.3}
              ry={size.height*0.05}
              fill="rgba(40, 40, 40, 0.9)"
              stroke="rgba(180, 160, 120, 0.7)"
              strokeWidth="1.5"
            />
            
            {/* Light effect on opening */}
            <ellipse
              cx="0"
              cy={-size.height*0.3}
              rx={size.width*0.25}
              ry={size.height*0.04}
              fill="url(#openingGlow)"
              opacity="0.7"
            />
            
            {/* Sack fill */}
            <clipPath id="sackClip">
              <path 
                d={`
                  M-${size.width*0.29},${-size.height*0.3}
                  C-${size.width*0.29},${-size.height*0.35}
                  -${size.width*0.15},${-size.height*0.39}
                  0,${-size.height*0.39}
                  C${size.width*0.15},${-size.height*0.39}
                  ${size.width*0.29},${-size.height*0.35}
                  ${size.width*0.29},${-size.height*0.3}
                  V${size.height*0.29}
                  C${size.width*0.29},${size.height*0.34}
                  ${size.width*0.2},${size.height*0.34}
                  0,${size.height*0.34}
                  C-${size.width*0.2},${size.height*0.34}
                  -${size.width*0.29},${size.height*0.34}
                  -${size.width*0.29},${size.height*0.29}
                  Z
                `}
              />
            </clipPath>
            
            {/* Fill rectangle with better gradient */}
            <rect
              ref={fillRef}
              x={-size.width*0.29}
              y={-size.height*0.4 + size.height*0.01}
              width={size.width*0.58}
              height={fillPercentage ? (size.height * 0.6) * (fillPercentage / 100) : 0}
              fill="url(#fillGradient)"
              clipPath="url(#sackClip)"
            />
            
            {/* Surface ripple effect */}
            {fillPercentage > 0 && (
              <ellipse
                cx="0"
                cy={-size.height*0.4 + size.height*0.01 + (size.height * 0.6) * (fillPercentage / 100)}
                rx={size.width*0.28}
                ry={size.height*0.01}
                fill="rgba(255, 255, 255, 0.2)"
                clipPath="url(#sackClip)"
              />
            )}
            
            {/* Items container */}
            <g 
              ref={itemsContainerRef} 
              transform={`translate(0, ${size.height*0.05})`}
            />
            
            {/* Capacity warning */}
            {currentWeight > capacity && (
              <g className="animate-pulse">
                <circle
                  cx="0"
                  cy={-size.height*0.15}
                  r="12"
                  fill="rgba(255, 0, 0, 0.2)"
                />
                <text
                  x="0"
                  y={-size.height*0.15}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="red"
                  fontWeight="bold"
                >
                  !
                </text>
                <text
                  x="0"
                  y={-size.height*0.15 + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill="red"
                >
                  Capacity exceeded
                </text>
              </g>
            )}
            
            {/* Empty state */}
            {(!selectedItems || selectedItems.length === 0) && (
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fontSize="14"
                fill="rgba(200, 200, 200, 0.5)"
              >
                No items selected
              </text>
            )}
          </g>
        </svg>
      </div>
      
      {/* Legend for item quality */}
      <div 
        ref={legendRef}
        className="mt-4 w-full max-w-xs flex flex-wrap justify-center gap-2 p-2 bg-gray-800 rounded-md shadow-md"
      >
        <div className="text-xs text-center w-full mb-1 text-gray-400">Item Quality (Value/Weight)</div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColorForRatio(1) }}></div>
          <span className="text-xs text-gray-300">Common</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorForRatio(2) }}></div>
          <span className="text-xs text-gray-300">Uncommon</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3" style={{ 
            backgroundColor: getColorForRatio(3), 
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
          }}></div>
          <span className="text-xs text-gray-300">Rare</span>
      </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4" style={{ 
            backgroundColor: getColorForRatio(5),
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
          }}></div>
          <span className="text-xs text-gray-300">Epic</span>
                    </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3" style={{ 
            backgroundColor: getColorForRatio(8),
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          }}></div>
          <span className="text-xs text-gray-300">Legendary</span>
        </div>
      </div>
    </div>
  )
}

export default KnapsackSack 