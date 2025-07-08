import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { deleteMovie } from '../db';

const { FiEdit2, FiTrash2, FiArrowLeft, FiCalendar, FiClock, FiTag, FiUser, FiBarcode } = FiIcons;

const MovieDetailComponent = ({ movie, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  if (!movie) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Movie details not available.</p>
      </div>
    );
  }
  
  const handleDelete = async () => {
    if (isDeleting) {
      try {
        await deleteMovie(movie.id);
        if (onDelete) onDelete();
        navigate('/collection');
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    } else {
      setIsDeleting(true);
    }
  };
  
  const formatRuntime = (minutes) => {
    if (!minutes) return 'Unknown';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        {movie.backdropPath && (
          <div className="w-full h-48 md:h-64 lg:h-80 overflow-hidden">
            <img
              src={movie.backdropPath}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          </div>
        )}
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors duration-200"
        >
          <SafeIcon icon={FiArrowLeft} />
        </button>
      </div>
      
      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 lg:w-1/4 flex-shrink-0 mb-6 md:mb-0 md:mr-6">
            <img
              src={movie.posterPath || 'https://via.placeholder.com/300x450?text=No+Image'}
              alt={movie.title}
              className="w-full rounded-lg shadow-md"
            />
          </div>
          
          <div className="md:flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map((genre) => (
                <span 
                  key={genre} 
                  className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {movie.releaseDate && (
                <div className="flex items-center text-gray-600">
                  <SafeIcon icon={FiCalendar} className="mr-2 text-indigo-500" />
                  <span>Released: {new Date(movie.releaseDate).toLocaleDateString()}</span>
                </div>
              )}
              
              {movie.runtime && (
                <div className="flex items-center text-gray-600">
                  <SafeIcon icon={FiClock} className="mr-2 text-indigo-500" />
                  <span>Runtime: {formatRuntime(movie.runtime)}</span>
                </div>
              )}
              
              {movie.rated && (
                <div className="flex items-center text-gray-600">
                  <SafeIcon icon={FiTag} className="mr-2 text-indigo-500" />
                  <span>Rated: {movie.rated}</span>
                </div>
              )}
              
              {movie.barcode && (
                <div className="flex items-center text-gray-600">
                  <SafeIcon icon={FiBarcode} className="mr-2 text-indigo-500" />
                  <span>Barcode: {movie.barcode}</span>
                </div>
              )}
            </div>
            
            {movie.overview && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Overview</h3>
                <p className="text-gray-600">{movie.overview}</p>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast?.map((actor) => (
                  <div 
                    key={actor} 
                    className="flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full"
                  >
                    <SafeIcon icon={FiUser} className="mr-1" />
                    <span>{actor}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className={`flex items-center justify-center px-4 py-2 rounded-md ${
                  isDeleting
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'border border-red-300 text-red-600 hover:bg-red-50'
                }`}
              >
                <SafeIcon icon={FiTrash2} className="mr-2" />
                {isDeleting ? 'Confirm Delete' : 'Delete'}
              </motion.button>
              
              {isDeleting && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDeleting(false)}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailComponent;