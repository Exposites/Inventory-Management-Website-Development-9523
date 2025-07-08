import { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiX } = FiIcons;

const SearchBar = ({ onSearch, searchType = 'title', onSearchTypeChange }) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };
  
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center">
          <div className="relative flex-1">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search by ${searchType}...`}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiX} />
              </button>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-r-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Search
          </motion.button>
        </div>
        
        {onSearchTypeChange && (
          <div className="flex mt-3 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="searchType"
                value="title"
                checked={searchType === 'title'}
                onChange={() => onSearchTypeChange('title')}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Search by Title</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="searchType"
                value="cast"
                checked={searchType === 'cast'}
                onChange={() => onSearchTypeChange('cast')}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">Search by Actor/Actress</span>
            </label>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;