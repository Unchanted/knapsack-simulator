export default function Footer() {
  return (
    <footer className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} 0/1 Knapsack Simulator | Created for Analysis of Algorithms
          </p>

          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#theory" className="text-sm text-gray-400 hover:text-white transition-colors">
              Algorithm Theory
            </a>
            <a href="#references" className="text-sm text-gray-400 hover:text-white transition-colors">
              References
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
              Source Code
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
