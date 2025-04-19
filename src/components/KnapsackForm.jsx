import React, { useState } from 'react'

const KnapsackForm = ({ onSubmit, initialItems, initialCapacity }) => {
  const [items, setItems] = useState(initialItems || [
    { id: 1, name: "Item 1", value: 60, weight: 10, isSelected: false },
    { id: 2, name: "Item 2", value: 100, weight: 20, isSelected: false },
    { id: 3, name: "Item 3", value: 120, weight: 30, isSelected: false },
  ])
  const [capacity, setCapacity] = useState(initialCapacity || 50)
  const [newItemName, setNewItemName] = useState('')
  const [newItemValue, setNewItemValue] = useState('')
  const [newItemWeight, setNewItemWeight] = useState('')
  const [showForm, setShowForm] = useState(false)

  const addItem = () => {
    if (!newItemName || !newItemValue || !newItemWeight) return
    
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    const newItem = {
      id: newId,
      name: newItemName,
      value: parseInt(newItemValue),
      weight: parseInt(newItemWeight),
      isSelected: false
    }
    
    setItems([...items, newItem])
    setNewItemName('')
    setNewItemValue('')
    setNewItemWeight('')
  }

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: field === 'name' ? value : parseInt(value) } : item
    ))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(items, capacity)
    setShowForm(false)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md">
      <button 
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium flex items-center"
      >
        {showForm ? 'Hide Configuration' : 'Configure Problem'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Knapsack Capacity</label>
            <input 
              type="number" 
              value={capacity} 
              onChange={(e) => setCapacity(parseInt(e.target.value))} 
              min="1"
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <h3 className="text-gray-300 mb-2">Items</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
                  <input 
                    type="text" 
                    value={item.name} 
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)} 
                    className="flex-grow bg-gray-600 text-white px-2 py-1 rounded"
                  />
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">V:</span>
                    <input 
                      type="number" 
                      value={item.value} 
                      onChange={(e) => updateItem(item.id, 'value', e.target.value)} 
                      className="w-16 bg-gray-600 text-white px-2 py-1 rounded"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">W:</span>
                    <input 
                      type="number" 
                      value={item.weight} 
                      onChange={(e) => updateItem(item.id, 'weight', e.target.value)} 
                      className="w-16 bg-gray-600 text-white px-2 py-1 rounded"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeItem(item.id)} 
                    className="text-red-400 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-gray-300 mb-2">Add New Item</h4>
            <div className="flex flex-wrap gap-2">
              <input 
                type="text" 
                placeholder="Name" 
                value={newItemName} 
                onChange={(e) => setNewItemName(e.target.value)} 
                className="flex-grow bg-gray-600 text-white px-3 py-2 rounded"
              />
              <input 
                type="number" 
                placeholder="Value" 
                value={newItemValue} 
                onChange={(e) => setNewItemValue(e.target.value)} 
                className="w-24 bg-gray-600 text-white px-3 py-2 rounded"
              />
              <input 
                type="number" 
                placeholder="Weight" 
                value={newItemWeight} 
                onChange={(e) => setNewItemWeight(e.target.value)} 
                className="w-24 bg-gray-600 text-white px-3 py-2 rounded"
              />
              <button 
                type="button"
                onClick={addItem} 
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium"
            >
              Apply Configuration
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default KnapsackForm 