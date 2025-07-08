import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCalendar, FiUsers } = FiIcons;

const MovieCard = ({ movie }) => {
  // Default placeholder image if poster is not available
  const placeholderImage = 'https://via.placeholder.com/300x450?text=No+Image';
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative pb-[150%]">
          <img
            src={movie.posterPath || placeholderImage}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
            {movie.title}
          </h3>
          
          {movie.releaseDate && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <SafeIcon icon={FiCalendar} className="mr-1" />
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
            </div>
          )}
          
          <div className="flex items-start text-sm text-gray-600">
            <SafeIcon icon={FiUsers} className="mr-1 mt-1 flex-shrink-0" />
            <p className="line-clamp-1">
              {movie.cast && movie.cast.slice(0, 3).join(', ')}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;