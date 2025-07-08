import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Scanner from '../components/Scanner';
import MovieForm from '../components/MovieForm';
import {searchByBarcode} from '../api/movieApi';
import {getMovieByBarcode} from '../db';

const {FiBarcode,FiCheck,FiEdit,FiSmartphone,FiWifi} = FiIcons;

const Scan = () => {
  const [barcode,setBarcode] = useState('');
  const [isScanning,setIsScanning] = useState(true);
  const [isLoading,setIsLoading] = useState(false);
  const [scanError,setScanError] = useState('');
  const [movie,setMovie] = useState(null);
  const [isEditing,setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleScanSuccess = async (decodedText) => {
    console.log('Scan successful in parent:',decodedText);
    setBarcode(decodedText);
    setIsScanning(false);
    setIsLoading(true);
    setScanError('');

    try {
      // First, check if we already have this movie in our collection
      const existingMovie = await getMovieByBarcode(decodedText);
      if (existingMovie) {
        navigate(`/movie/${existingMovie.id}`);
        return;
      }

      // If movie doesn't exist in our collection, search the API
      const movieData = await searchByBarcode(decodedText);
      
      setMovie({
        ...movieData,
        barcode: decodedText
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error fetching movie data:',error);
      setScanError(error.message || 'Failed to find movie. Try manual entry.');
      
      setMovie({
        barcode: decodedText,
        title: '',
        releaseDate: '',
        cast: [''],
        posterPath: '',
        overview: ''
      });
      
      setIsEditing(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanFailure = (error) => {
    console.error('Scan error in parent:',error);
    setScanError('Failed to scan barcode. Please try again.');
  };

  const handleSaveMovie = (savedMovie) => {
    navigate(`/movie/${savedMovie.id}`);
  };

  const handleStartOver = () => {
    setBarcode('');
    setMovie(null);
    setScanError('');
    setIsScanning(true);
    setIsEditing(false);
  };

  const hasCamera = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

  return (
    <motion.div 
      initial={{opacity: 0}} 
      animate={{opacity: 1}} 
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Scan DVD Barcode
        </h1>
        <p className="text-gray-600 mt-1">
          Use your device's camera to scan the barcode on your DVD case
        </p>
      </div>

      {/* Device compatibility warnings */}
      {!hasCamera && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          <div className="flex items-start">
            <SafeIcon icon={FiSmartphone} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Camera Not Available</p>
              <p className="text-sm mt-1">
                Your device doesn't support camera access. Please use a device with a camera.
              </p>
            </div>
          </div>
        </div>
      )}

      {hasCamera && location.protocol !== 'https:' && location.hostname !== 'localhost' && (
        <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 rounded-md">
          <div className="flex items-start">
            <SafeIcon icon={FiWifi} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Secure Connection Required</p>
              <p className="text-sm mt-1">
                Camera access requires HTTPS. Please access this app via a secure connection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scanner or Results */}
      {isScanning && hasCamera ? (
        <div className="mb-6">
          <Scanner 
            onScanSuccess={handleScanSuccess} 
            onScanFailure={handleScanFailure} 
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-3 text-gray-600">
                Searching for movie information...
              </p>
            </div>
          ) : (
            <>
              {barcode && (
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <SafeIcon icon={FiBarcode} className="text-indigo-600 mr-2" />
                    <span className="font-medium">Barcode:</span>
                    <span className="ml-2 text-gray-700">{barcode}</span>
                  </div>
                  <button
                    onClick={handleStartOver}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Scan Another
                  </button>
                </div>
              )}

              {scanError && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
                  {scanError}
                </div>
              )}

              {movie && !isEditing && (
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      {movie.title}
                    </h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      <SafeIcon icon={FiEdit} className="mr-1" />
                      Edit
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    {movie.posterPath && (
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="w-32 h-48 object-cover rounded-md mb-4 md:mb-0 md:mr-4"
                      />
                    )}
                    <div>
                      {movie.releaseDate && (
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Release Date:</span>{' '}
                          {new Date(movie.releaseDate).toLocaleDateString()}
                        </p>
                      )}
                      {movie.cast && movie.cast.length > 0 && (
                        <div className="mb-3">
                          <p className="font-medium text-gray-700">Cast:</p>
                          <ul className="list-disc list-inside text-gray-600 pl-2">
                            {movie.cast.map((actor,index) => (
                              <li key={index}>{actor}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {movie.overview && (
                        <div className="mt-2">
                          <p className="font-medium text-gray-700">Overview:</p>
                          <p className="text-gray-600 text-sm">{movie.overview}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <motion.button
                      whileHover={{scale: 1.05}}
                      whileTap={{scale: 0.95}}
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      <SafeIcon icon={FiCheck} className="mr-2" />
                      Add to Collection
                    </motion.button>
                  </div>
                </div>
              )}

              {(isEditing || (movie && !movie.title)) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {scanError ? 'Enter Movie Details' : 'Edit Movie Details'}
                  </h3>
                  <MovieForm
                    movie={movie}
                    onSave={handleSaveMovie}
                    onCancel={() => {
                      if (movie && movie.title) {
                        setIsEditing(false);
                      } else {
                        handleStartOver();
                      }
                    }}
                  />
                </div>
              )}

              {/* Manual entry for devices without camera */}
              {!movie && !hasCamera && (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Manual Entry
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Enter movie details manually since camera is not available.
                  </p>
                  <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    onClick={() => {
                      setMovie({
                        barcode: '',
                        title: '',
                        releaseDate: '',
                        cast: [''],
                        posterPath: '',
                        overview: ''
                      });
                      setIsEditing(true);
                    }}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add Movie Manually
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Scan;