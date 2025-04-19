import React, { useRef, useEffect } from 'react'
import anime from 'animejs'

const ItemsList = ({ items, updateItem, removeItem, addNewItem, selectedItems }) => {
  const tableRef = useRef(null)
  const itemRefs = useRef({})
  const buttonRef = useRef(null)

  const handleChange = (id, field, event) => {
    const value = field === 'name' ? event.target.value : parseInt(event.target.value)
    updateItem(id, field, value)
  }

  // Initialize button animation
  useEffect(() => {
    if (buttonRef.current) {
      anime({
        targets: buttonRef.current,
        scale: [1, 1.05, 1],
        duration: 2000,
        easing: 'easeInOutQuad',
        loop: true
      })
    }
  }, [])

  // Animate new items when they're added or selected
  useEffect(() => {
    if (items.length > 0) {
      items.forEach(item => {
        const isSelected = selectedItems.some(selectedItem => selectedItem.id === item.id)
        const itemElement = itemRefs.current[item.id]
        
        if (itemElement) {
          // Highlight selected items
          if (isSelected) {
            anime({
              targets: itemElement,
              backgroundColor: 'rgba(79, 70, 229, 0.2)',
              translateX: [10, 0],
              duration: 500,
              easing: 'easeOutQuad'
            })
          } else {
            anime({
              targets: itemElement,
              backgroundColor: 'rgba(0, 0, 0, 0)',
              translateX: 0,
              duration: 300,
              easing: 'easeOutQuad'
            })
          }
        }
      })
    }
  }, [items, selectedItems])

  // Add new item animation
  const animateNewItem = (id) => {
    const element = itemRefs.current[id]
    if (element) {
      anime({
        targets: element,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutElastic(1, .6)'
      })
    }
  }

  // Remove item animation
  const animateItemRemoval = (id) => {
    const element = itemRefs.current[id]
    if (element) {
      anime({
        targets: element,
        translateX: [0, 20],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeOutQuad',
        complete: () => {
          removeItem(id)
        }
      })
    } else {
      removeItem(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table ref={tableRef} className="w-full text-sm">
          <thead className="text-xs uppercase bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-center">Value</th>
              <th className="px-4 py-2 text-center">Weight</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isSelected = selectedItems.some(selectedItem => selectedItem.id === item.id)
              
              return (
                <tr 
                  key={item.id}
                  ref={el => itemRefs.current[item.id] = el}
                  className={`border-t border-gray-700 ${isSelected ? 'bg-primary bg-opacity-20' : ''}`}
                >
                  <td className="px-4 py-2">
                    <input 
                      type="text" 
                      value={item.name} 
                      onChange={(e) => handleChange(item.id, 'name', e)}
                      className="w-full bg-gray-700 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="number" 
                      min="1"
                      value={item.value} 
                      onChange={(e) => handleChange(item.id, 'value', e)}
                      className="w-full bg-gray-700 rounded px-2 py-1 text-center"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="number"
                      min="1" 
                      value={item.weight}
                      onChange={(e) => handleChange(item.id, 'weight', e)}
                      className="w-full bg-gray-700 rounded px-2 py-1 text-center"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button 
                      onClick={() => animateItemRemoval(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Remove
                    </button>
                    {isSelected && (
                      <span 
                        className="ml-2 inline-block px-2 py-1 bg-secondary text-xs rounded-full"
                      >
                        Selected
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-center pt-2">
        <button
          ref={buttonRef}
          onClick={() => {
            const newId = Math.max(...(items.map(i => i.id)), 0) + 1
            addNewItem()
            // Wait for next render to get the reference
            setTimeout(() => animateNewItem(newId), 50)
          }}
          className="bg-accent hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add New Item
        </button>
      </div>
    </div>
  )
}

export default ItemsList 