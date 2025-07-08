import { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { generateMovieReport } from '../utils/reportGenerator';
import SafeIcon from '../common/SafeIcon';

const { FiFileText, FiDownload, FiCheckCircle, FiAlertCircle } = FiIcons;

const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  
  // Get the total count of movies
  const movieCount = useLiveQuery(() => db.movies.count());
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setResult(null);
    
    try {
      const generationResult = await generateMovieReport();
      setResult(generationResult);
    } catch (error) {
      console.error('Error in report generation:', error);
      setResult({
        success: false,
        error: error.message || 'Failed to generate report'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          DVD Collection Reports
        </h1>
        <p className="text-gray-600 mt-1">
          Generate and print reports of your DVD collection
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <SafeIcon icon={FiFileText} className="text-xl" />
          </div>
          
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Alphabetical Collection Report
            </h2>
            
            <p className="text-gray-600 mb-4">
              Generate a printable PDF report of all DVDs in your collection, sorted alphabetically by title. The report includes title, release year, and main cast members.
            </p>
            
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="font-medium mr-2">Movies in collection:</span>
              {movieCount !== undefined ? (
                <span>{movieCount}</span>
              ) : (
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
              )}
            </div>
            
            {result && (
              <div className={`p-3 rounded-md mb-4 ${
                result.success
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                <div className="flex items-center">
                  <SafeIcon
                    icon={result.success ? FiCheckCircle : FiAlertCircle}
                    className="mr-2"
                  />
                  <span>
                    {result.success
                      ? 'Report generated successfully! Check your downloads.'
                      : `Error: ${result.error}`}
                  </span>
                </div>
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateReport}
              disabled={isGenerating || movieCount === 0}
              className={`flex items-center px-4 py-2 rounded-md ${
                movieCount === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <SafeIcon icon={FiDownload} className="mr-2" />
                  Generate Report
                </>
              )}
            </motion.button>
            
            {movieCount === 0 && (
              <p className="text-sm text-red-500 mt-2">
                Add movies to your collection before generating a report.
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-900 mb-2">
          How to Print Your Report
        </h3>
        
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>Generate the report using the button above</li>
          <li>The report will download as a PDF file</li>
          <li>Open the PDF file with any PDF viewer</li>
          <li>Use the print function in your PDF viewer to print the report</li>
          <li>You can also email the PDF to print it elsewhere</li>
        </ol>
      </div>
    </motion.div>
  );
};

export default Reports;