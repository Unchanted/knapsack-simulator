import { motion } from 'framer-motion';
import useKnapsackStore from '../../store/knapsackStore';

export default function ItemsList() {
  const { items, removeItem, updateItem } = useKnapsackStore();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="glass rounded-lg p-4 mb-4">
      <h3 className="text-xl font-bold mb-3 text-secondary-300">Items List</h3>

      {items.length === 0 ? (
        <p className="text-gray-400">No items added yet. Add some items above!</p>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {items.map((itemData) => (
            <motion.div
              key={itemData.id}
              variants={item}
              className="bg-gray-800 rounded-lg p-3 relative overflow-hidden"
              style={{ borderLeft: `4px solid ${itemData.color}` }}
            >
              <div className="absolute top-0 right-0 left-0 h-1" style={{ backgroundColor: itemData.color }} />

              <h4 className="font-bold">{itemData.name}</h4>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400">Weight</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={itemData.weight}
                    onChange={(e) => updateItem(itemData.id, { weight: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Value</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={itemData.value}
                    onChange={(e) => updateItem(itemData.id, { value: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm text-sm"
                  />
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div className="inline-flex items-center text-sm">
                  <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: itemData.color }}></span>
                  <span className="text-gray-300">Ratio: {(itemData.value / itemData.weight).toFixed(2)}</span>
                </div>

                <button
                  onClick={() => removeItem(itemData.id)}
                  className="text-xs px-2 py-1 rounded bg-red-900 hover:bg-red-800 text-white"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
