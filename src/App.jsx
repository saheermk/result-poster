import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <div className="flex-grow">
        <Dashboard />
      </div>
      <footer className="py-6 text-center text-sm text-gray-400 bg-white border-t border-gray-100 mt-auto">
        <p>Made by <span className="font-medium text-indigo-500">saheermk</span></p>
      </footer>
    </div>
  );
}

export default App;
