import { useState } from 'react';
import useKnapsackStore from '../../store/knapsackStore';

export default function ItemForm() {
  const { addItem } = useKnapsackStore();
  const [name, setName] = useState('');
  const [weight, setWeight] = useState(1);
  const [value, setValue] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    const colors = [
      '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2',
      '#EF476F', '#FFC43D', '#1B9AAA', '#6F2DBD', '#F15BB5'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const shapes = ['cube', 'sphere', 'cylinder', 'cone', 'torus'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    addItem({
      name: name || `Item ${Math.floor(Math.random() * 1000)}`,
      weight: Number(weight),
      value: Number(value),
      color,
      shape
    });

    setName('');
    setWeight(1);
    setValue(1);
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-lg p-4 mb-4">
      <h3 className="text-xl font-bold mb-3 text-secondary-300">Add New Item</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-200">
            Name (Optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-secondary-400 focus:ring focus:ring-secondary-500 focus:ring-opacity-50"
            placeholder="Item name"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-200">
            Weight
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-secondary-400 focus:ring focus:ring-secondary-500 focus:ring-opacity-50"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-200">
            Value
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-secondary-400 focus:ring focus:ring-secondary-500 focus:ring-opacity-50"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary-600 text-base font-medium text-white hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 sm:w-auto sm:text-sm"
      >
        Add Item
      </button>
    </form>
  );
}
