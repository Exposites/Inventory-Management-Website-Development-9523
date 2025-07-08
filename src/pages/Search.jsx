import { useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';
import { searchMoviesByTitle, searchMoviesByCast } from '../db';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = async (query) => {
    setSearchTerm(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      let results;
      if (searchType === 'title') {
        results = await searchMoviesByTitle(query);
      } else {
        results = await searchMoviesByCast(query);
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Search Your Collection
        </h1>
        <p className="text-gray-600 mt-1">
          Find movies by title or by the actors and actresses in them
        </p>
      </div>
      
      <div className="mb-8">
        <SearchBar 
          onSearch={handleSearch} 
          searchType={searchType}
          onSearchTypeChange={handleSearchTypeChange}
        />
      </div>
      
      {isSearching ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-3 text-gray-600">Searching...</p>
        </div>
      ) : (
        hasSearched && (
          searchResults.length > 0 ? (
            <MovieList
              movies={searchResults}
              title={`Results for "${searchTerm}"`}
            />
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                No movies matching "{searchTerm}" were found in your collection.
              </p>
            </div>
          )
        )
      )}
      
      {!hasSearched && (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600">
            Enter a search term above to find movies in your collection.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Search by {searchType === 'title' ? 'movie title' : 'actor or actress name'}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Search;