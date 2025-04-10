import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import useKnapsackStore from './store/knapsackStore';

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

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


      <Footer />
    </div>
  );
}
