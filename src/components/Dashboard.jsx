import React, { useState } from 'react';
import { fetchClassData } from '../services/api';
import { DEMO_DATA } from '../services/demoData';
import { Search, Loader2, Database } from 'lucide-react';
import ResultCard from './ResultCard';

// Use env variable if available, otherwise empty
const DEFAULT_SHEET_URL = import.meta.env.VITE_SHEET_URL || "";

const Dashboard = () => {
// Removed unused sheetUrl state
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  // Effect to auto-load data if env var is present
  React.useEffect(() => {
    if (DEFAULT_SHEET_URL) {
      handleFetchData();
    }
  }, []);

  const handleFetchData = async () => {
    const urlToFetch = DEFAULT_SHEET_URL;
    if (!urlToFetch) {
      setError("No Google Sheet URL configured. Please set VITE_SHEET_URL in .env");
      return;
    }
    setLoading(true);
    setError(null);
    setIsDemo(false);
    try {
      const data = await fetchClassData(urlToFetch);
      setClassData(data);
      setSelectedStudent(null);
    } catch (err) {
      setError("Failed to fetch data. Ensure the URL in .env is valid.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!classData || !searchQuery) return;
    const student = classData.students.find(s => 
      s.student_id?.toLowerCase() === searchQuery.toLowerCase() || 
      s.roll_no?.toLowerCase() === searchQuery.toLowerCase() ||
      s.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (student) {
      setSelectedStudent(student);
      setError(null);
    } else {
      setSelectedStudent(null);
      setError("Student not found.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Academic Result Generator
        </h1>
        <p className="text-gray-600 mt-2">Enter Student ID, Roll No, or Name</p>
      </header>

      {/* Configuration Section */}
      
      {/* Search Section (Only visible after data is loaded) */}
      {classData && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-lg font-semibold mb-4">Find Student</h2>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter Student ID, Roll No, or Name"
                className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Result Display */}
      {selectedStudent && classData && (
        <div className="flex justify-center animate-in zoom-in-95 duration-300">
          <ResultCard 
            student={selectedStudent} 
            subjects={classData.subjects} 
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
