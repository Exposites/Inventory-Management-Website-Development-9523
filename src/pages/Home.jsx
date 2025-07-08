import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import SafeIcon from '../common/SafeIcon';
import MovieList from '../components/MovieList';

const { FiCamera, FiFilm, FiSearch, FiFileText } = FiIcons;

const Home = () => {
  // Get recently added movies
  const recentMovies = useLiveQuery(
    () => db.movies
      .orderBy('added')
      .reverse()
      .limit(5)
      .toArray()
  );
  
  // Features list for the homepage
  const features = [
    {
      icon: FiCamera,
      title: 'Scan DVDs',
      description: 'Use your camera to scan DVD barcodes and add them to your collection.',
      link: '/scan',
      color: 'bg-indigo-600'
    },
    {
      icon: FiFilm,
      title: 'View Collection',
      description: 'Browse and manage your entire DVD library.',
      link: '/collection',
      color: 'bg-purple-600'
    },
    {
      icon: FiSearch,
      title: 'Search Movies',
      description: 'Find movies by title or by the actors and actresses in them.',
      link: '/search',
      color: 'bg-green-600'
    },
    {
      icon: FiFileText,
      title: 'Generate Reports',
      description: 'Create and print alphabetical reports of your collection.',
      link: '/reports',
      color: 'bg-orange-500'
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="text-center py-8">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-3"
        >
          DVD Collection Catalog
        </motion.h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Easily scan, catalog, and manage your DVD collection. Keep track of all your movies and find them quickly by title or cast.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              to={feature.link}
              className="block h-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${feature.color} text-white`}>
                  <SafeIcon icon={feature.icon} className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {recentMovies && recentMovies.length > 0 && (
        <div className="mt-8">
          <MovieList 
            movies={recentMovies} 
            title="Recently Added" 
          />
          
          <div className="text-center mt-4">
            <Link
              to="/collection"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              View all movies
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Home;