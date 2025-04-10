import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      className="relative z-10 py-6 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400">
            0/1 Knapsack Simulator
          </h1>
          <p className="mt-1 text-gray-300">
            Dynamic Programming Visualization
          </p>
        </div>

        <nav className="hidden md:flex space-x-10">
          <a href="#about" className="text-base font-medium text-gray-300 hover:text-white transition-colors">
            About
          </a>
          <a href="#howto" className="text-base font-medium text-gray-300 hover:text-white transition-colors">
            How To Use
          </a>
          <a href="#theory" className="text-base font-medium text-gray-300 hover:text-white transition-colors">
            Theory
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
