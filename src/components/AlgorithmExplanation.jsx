import { useState, useRef, useEffect } from 'react'
import anime from 'animejs'

const AlgorithmExplanation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef(null)
  const arrowRef = useRef(null)
  const contentHeight = useRef(0)
  
  useEffect(() => {
    // Store the full height of the content for animations
    if (contentRef.current && isOpen) {
      // Wait for the content to render
      setTimeout(() => {
        contentHeight.current = contentRef.current.scrollHeight
      }, 50)
    }
  }, [isOpen])
  
  const toggleOpen = () => {
    if (contentRef.current) {
      if (!isOpen) {
        // Opening animation
        // First set height to 0 and opacity to 0
        contentRef.current.style.height = '0px'
        contentRef.current.style.opacity = '0'
        contentRef.current.style.display = 'block'
        
        // Animate arrow
        anime({
          targets: arrowRef.current,
          rotate: 180,
          duration: 400,
          easing: 'easeOutQuad'
        })
        
        // Then animate to full height and opacity 1
        anime({
          targets: contentRef.current,
          height: [0, contentHeight.current || 'auto'],
          opacity: [0, 1],
          duration: 500,
          easing: 'easeOutQuart',
          complete: () => {
            // Ensure it's set to auto height after animation
            contentRef.current.style.height = 'auto'
          }
        })
      } else {
        // Closing animation
        // First get the current height
        const height = contentRef.current.offsetHeight
        contentRef.current.style.height = `${height}px`
        
        // Animate arrow
        anime({
          targets: arrowRef.current,
          rotate: 0,
          duration: 400,
          easing: 'easeOutQuad'
        })
        
        // Then animate to height 0 and opacity 0
        anime({
          targets: contentRef.current,
          height: 0,
          opacity: 0,
          duration: 400,
          easing: 'easeOutQuart',
          complete: () => {
            contentRef.current.style.display = 'none'
          }
        })
      }
    }
    
    setIsOpen(!isOpen)
  }
  
  return (
    <div className="mt-8 bg-surface rounded-lg p-5 shadow-lg">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleOpen}
      >
        <h2 className="text-2xl font-semibold text-primary">
          Algorithm Explanation
        </h2>
        <div
          ref={arrowRef}
          className="text-gray-400"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ 
          display: isOpen ? 'block' : 'none',
          height: isOpen ? 'auto' : '0px',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="mt-4 text-gray-300 space-y-4 text-left">
          <div>
            <h3 className="text-lg font-medium text-accent mb-2">What is the 0/1 Knapsack Problem?</h3>
            <p>
              The 0/1 Knapsack Problem is a classic optimization problem in computer science. Given a set of items, 
              each with a weight and a value, determine which items to include in a collection (the "knapsack") 
              so that the total weight is less than or equal to a given limit (capacity) and the total value is as large as possible.
            </p>
            <p className="mt-2">
              The "0/1" refers to the constraint that each item can either be included (1) or not included (0) - 
              partial items are not allowed.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-accent mb-2">Dynamic Programming Approach</h3>
            <p>
              Dynamic Programming is an optimization technique that solves complex problems by breaking them down 
              into simpler subproblems. For the 0/1 Knapsack Problem, we create a table where:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Each row represents considering up to the i-th item</li>
              <li>Each column represents a capacity from 0 to the maximum capacity W</li>
              <li>Each cell DP[i][j] represents the maximum value that can be obtained with the first i items and a capacity of j</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-accent mb-2">The Algorithm</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Initialization:</strong> Create a 2D array DP of size (n+1) × (W+1), where n is the number of items 
                and W is the knapsack capacity. Set all values in the first row and column to 0.
              </li>
              <li>
                <strong>Fill the DP table:</strong> For each item i and each possible capacity j:
                <ul className="list-disc pl-5 mt-1">
                  <li>If the weight of item i is greater than capacity j, we can't include it: DP[i][j] = DP[i-1][j]</li>
                  <li>
                    Otherwise, we take the maximum of:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Not including the item: DP[i-1][j]</li>
                      <li>Including the item: value[i] + DP[i-1][j-weight[i]]</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Find the optimal solution:</strong> The value in DP[n][W] represents the maximum value achievable.
              </li>
              <li>
                <strong>Backtrack to find selected items:</strong> Trace back through the table to determine which items were selected.
              </li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-accent mb-2">Complexity Analysis</h3>
            <p>
              <strong>Time Complexity:</strong> O(n×W) where n is the number of items and W is the capacity.
            </p>
            <p>
              <strong>Space Complexity:</strong> O(n×W) for storing the dynamic programming table.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-accent mb-2">Applications</h3>
            <p>The Knapsack Problem has numerous real-world applications:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Resource allocation in finance, computing, and more</li>
              <li>Cargo loading and logistics</li>
              <li>Budget constraints in project selection</li>
              <li>Portfolio optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlgorithmExplanation 