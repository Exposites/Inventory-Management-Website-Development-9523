import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMovieById } from '../db';
import MovieDetailComponent from '../components/MovieDetail';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      try {
        const movieData = await getMovieById(parseInt(id));
        if (movieData) {
          setMovie(movieData);
        } else {
          setError('Movie not found');
        }
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchMovie();
    }
  }, [id]);
  
  const handleDelete = () => {
    // This is handled in the MovieDetailComponent
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-3 text-gray-600">Loading movie details...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-red-600">{error}</p>
          <a
            href="#/collection"
            className="inline-block mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Return to Collection
          </a>
        </div>
      ) : (
        <MovieDetailComponent movie={movie} onDelete={handleDelete} />
      )}
    </motion.div>
  );
};

export default MovieDetail;