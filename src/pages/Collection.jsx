import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';

const Collection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  
  // Get all movies from the database
  const movies = useLiveQuery(() => db.movies.toArray());
  
  // Filter movies based on search term
  useEffect(() => {
    if (!movies) return;
    
    if (!searchTerm.trim()) {
      setFilteredMovies(movies);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const filtered = movies.filter(movie => 
        movie.title.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredMovies(filtered);
    }
  }, [movies, searchTerm]);
  
  const handleSearch = (query) => {
    setSearchTerm(query);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Your DVD Collection
        </h1>
        <p className="text-gray-600 mt-1">
          {movies?.length || 0} {movies?.length === 1 ? 'movie' : 'movies'} in your collection
        </p>
      </div>
      
      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {!movies ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-3 text-gray-600">Loading your collection...</p>
        </div>
      ) : (
        <MovieList
          movies={filteredMovies}
          title={searchTerm ? 'Search Results' : 'All Movies'}
        />
      )}
      
      {movies && movies.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your collection is empty</h3>
          <p className="text-gray-600 mb-4">
            Start by scanning DVD barcodes to add movies to your collection.
          </p>
          <a
            href="#/scan"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Scan a DVD
          </a>
        </div>
      )}
      
      {filteredMovies && filteredMovies.length === 0 && searchTerm && (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            No movies matching "{searchTerm}" were found in your collection.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default Collection;