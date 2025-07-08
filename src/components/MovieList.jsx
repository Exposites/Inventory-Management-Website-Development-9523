import { useState } from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiGrid, FiList } = FiIcons;

const MovieList = ({ movies, title }) => {
  const [viewType, setViewType] = useState('grid');
  
  if (!movies || movies.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600">No movies found in your collection.</p>
      </div>
    );
  }
  
  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {title || 'Your Collection'}
          <span className="ml-2 text-gray-500 text-sm font-normal">
            ({movies.length} {movies.length === 1 ? 'movie' : 'movies'})
          </span>
        </h2>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewType('grid')}
            className={`p-2 rounded-md ${
              viewType === 'grid'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <SafeIcon icon={FiGrid} />
          </button>
          
          <button
            onClick={() => setViewType('list')}
            className={`p-2 rounded-md ${
              viewType === 'list'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <SafeIcon icon={FiList} />
          </button>
        </div>
      </div>
      
      {viewType === 'grid' ? (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ backgroundColor: '#f9fafb' }}
              className="flex items-center p-3 border border-gray-200 rounded-lg"
            >
              <img
                src={movie.posterPath || 'https://via.placeholder.com/300x450?text=No+Image'}
                alt={movie.title}
                className="w-16 h-24 object-cover rounded mr-4"
                loading="lazy"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{movie.title}</h3>
                <p className="text-sm text-gray-600">
                  {movie.releaseDate && new Date(movie.releaseDate).getFullYear()}
                </p>
                <p className="text-sm text-gray-600 line-clamp-1">
                  Cast: {movie.cast && movie.cast.slice(0, 3).join(', ')}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MovieList;