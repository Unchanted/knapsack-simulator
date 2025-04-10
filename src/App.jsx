import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import KnapsackScene from './components/three/KnapsackScene';
import ItemForm from './components/ui/ItemForm';
import ItemsList from './components/ui/ItemsList';
import KnapsackControls from './components/ui/KnapsackControls';
import DPTable from './components/ui/DPTable';
import Explanation from './components/ui/Explanation';
import InfoSections from './components/InfoSections';
import useKnapsackStore from './store/knapsackStore';

export default function App() {
  const [infoOpen, setInfoOpen] = useState(false);
  const { solution, generateRandomItems } = useKnapsackStore();

  useEffect(() => {
    generateRandomItems(5);
  }, [generateRandomItems]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Ambient background gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 bg-secondary-600 rounded-full opacity-10 w-96 h-96 blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute top-1/4 left-0 bg-primary-600 rounded-full opacity-10 w-96 h-96 blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-1/4 bg-accent-600 rounded-full opacity-10 w-96 h-96 blur-3xl translate-y-1/2" />
      </div>

      {/* Minimal header */}
      <div className="relative z-10 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400">
          0/1 Knapsack Simulator
        </h1>

        <button
          onClick={() => setInfoOpen(!infoOpen)}
          className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          {infoOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
      </div>

      <main className="flex-grow relative z-10">
        <div className="h-[70vh] mb-4">
          <Suspense fallback={<div className="h-full flex items-center justify-center">
            <div className="h-16 w-16 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          </div>}>
            <KnapsackScene />
          </Suspense>
        </div>

        {/* Minimalist controls */}
        <div className="px-4 pb-4">
          <KnapsackControls />

          {solution && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DPTable />
            </motion.div>
          )}
        </div>
      </main>

      {/* Sliding info panel */}
      <AnimatePresence>
        {infoOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 z-20 bg-slate-900/95 backdrop-blur-sm overflow-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
                  Knapsack Problem
                </h2>
                <button
                  onClick={() => setInfoOpen(false)}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <InfoSections />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
