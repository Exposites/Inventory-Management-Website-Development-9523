// API Key for TMDB
const TMDB_API_KEY = 'e9e9d8da18ae29fc430845952232787c'; // This is a public demo API key

// Base URLs for API calls
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_BASE_URL = 'https://www.omdbapi.com';
const OMDB_API_KEY = '8a96c28a'; // This is a public demo API key

// Function to search for a movie by UPC/barcode (using TMDB)
export const searchByBarcode = async (barcode) => {
  try {
    // Lookup barcode/UPC in movie database
    // Since TMDB doesn't directly support UPC lookup, we'll first try to find details
    // using a third-party API or simulate this functionality
    
    // For demo purposes, we're going to use a search by external ID approach
    // In a real app, you would integrate with a UPC database API
    
    // First attempt: Try to get movie info by external ID (UPC/EAN)
    const response = await fetch(
      `${TMDB_BASE_URL}/find/${barcode}?api_key=${TMDB_API_KEY}&external_source=upc_ean`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie by barcode');
    }
    
    const data = await response.json();
    
    // If we found results, return the first movie
    if (data.movie_results && data.movie_results.length > 0) {
      const movie = data.movie_results[0];
      return await getMovieDetails(movie.id);
    }
    
    // If no results, try a fallback approach
    // In a real app, you might query a UPC database first to get the title
    // Then search by title in TMDB
    
    // Simulate fallback for demo: Use a dummy approach
    // In real app, this would be replaced with actual UPC database query
    const dummyMovieMap = {
      '024543273738': { title: 'Avatar', year: '2009' }, // Example UPC for Avatar
      '191329060858': { title: 'Star Wars: The Last Jedi', year: '2017' },
      '191329001769': { title: 'Avengers: Infinity War', year: '2018' },
      // Add more mappings as needed
    };
    
    if (dummyMovieMap[barcode]) {
      const { title, year } = dummyMovieMap[barcode];
      return await searchMovieByTitle(title, year);
    }
    
    // If all approaches fail
    throw new Error('Movie not found with this barcode');
  } catch (error) {
    console.error('Error searching by barcode:', error);
    throw error;
  }
};

// Function to search for a movie by title (and optionally year)
export const searchMovieByTitle = async (title, year = '') => {
  try {
    let url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
    
    if (year) {
      url += `&year=${year}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie by title');
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Get full details of the first movie
      return await getMovieDetails(data.results[0].id);
    }
    
    throw new Error('No movies found with this title');
  } catch (error) {
    console.error('Error searching by title:', error);
    throw error;
  }
};

// Function to get detailed information about a movie
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    
    const data = await response.json();
    
    // Extract main cast (top 10 billed actors)
    const cast = data.credits.cast
      .slice(0, 10)
      .map(actor => actor.name);
    
    // Get additional data from OMDB for more complete information
    let omdbData = {};
    try {
      const omdbResponse = await fetch(
        `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=tt${data.imdb_id?.replace('tt', '')}`
      );
      
      if (omdbResponse.ok) {
        omdbData = await omdbResponse.json();
      }
    } catch (error) {
      console.warn('Failed to fetch additional data from OMDB:', error);
    }
    
    // Construct a comprehensive movie object
    return {
      id: data.id,
      tmdbId: data.id,
      imdbId: data.imdb_id,
      title: data.title,
      originalTitle: data.original_title,
      releaseDate: data.release_date,
      overview: data.overview,
      posterPath: data.poster_path 
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : null,
      backdropPath: data.backdrop_path 
        ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
        : null,
      runtime: data.runtime,
      genres: data.genres.map(genre => genre.name),
      cast,
      director: omdbData.Director || 'Unknown',
      rated: omdbData.Rated || 'Not Rated',
      barcode: '', // This will be filled in by the scanning component
    };
  } catch (error) {
    console.error('Error getting movie details:', error);
    throw error;
  }
};