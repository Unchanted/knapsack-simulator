import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import InfoSections from './components/InfoSections';
import KnapsackScene from './components/three/KnapsackScene';
import ItemForm from './components/ui/ItemForm';
import ItemsList from './components/ui/ItemsList';
import KnapsackControls from './components/ui/KnapsackControls';
import DPTable from './components/ui/DPTable';
import Explanation from './components/ui/Explanation';
import useKnapsackStore from './store/knapsackStore';

export default function App() {
  const [mounted, setMounted] = useState(false);
  const { solution } = useKnapsackStore();

  useEffect(() => {
    setMounted(true);

    // initial random items 
    useKnapsackStore.getState().generateRandomItems(5);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 bg-secondary-600 rounded-full opacity-10 w-96 h-96 blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute top-1/4 left-0 bg-primary-600 rounded-full opacity-10 w-96 h-96 blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-1/4 bg-accent-600 rounded-full opacity-10 w-96 h-96 blur-3xl translate-y-1/2" />
      </div>

      <Header />

      <main className="flex-grow relative z-10">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8 aspect-[16/9] max-h-[70vh]"
            >
              <KnapsackScene />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <ItemForm />
                <KnapsackControls />
              </div>
              <div>
                <ItemsList />
              </div>
            </div>

            {solution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Explanation />
                <DPTable />
              </motion.div>
            )}

            <InfoSections />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
