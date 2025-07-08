import Dexie from 'dexie';

// Initialize the database
export const db = new Dexie('DVDCatalogDB');

// Define the database schema
db.version(1).stores({
  movies: '++id, barcode, title, *cast, added, lastModified',
});

// Function to add a movie to the database
export const addMovie = async (movie) => {
  try {
    // Check if movie with this barcode already exists
    const existingMovie = await db.movies.where({ barcode: movie.barcode }).first();
    
    if (existingMovie) {
      // Update existing movie
      await db.movies.update(existingMovie.id, {
        ...movie,
        lastModified: new Date().toISOString()
      });
      return existingMovie.id;
    } else {
      // Add new movie
      const now = new Date().toISOString();
      const id = await db.movies.add({
        ...movie,
        added: now,
        lastModified: now
      });
      return id;
    }
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

// Function to get all movies
export const getAllMovies = async () => {
  try {
    return await db.movies.toArray();
  } catch (error) {
    console.error('Error getting movies:', error);
    throw error;
  }
};

// Function to get movie by ID
export const getMovieById = async (id) => {
  try {
    return await db.movies.get(id);
  } catch (error) {
    console.error('Error getting movie:', error);
    throw error;
  }
};

// Function to get movie by barcode
export const getMovieByBarcode = async (barcode) => {
  try {
    return await db.movies.where({ barcode }).first();
  } catch (error) {
    console.error('Error getting movie by barcode:', error);
    throw error;
  }
};

// Function to delete a movie
export const deleteMovie = async (id) => {
  try {
    await db.movies.delete(id);
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};

// Function to search movies by title
export const searchMoviesByTitle = async (title) => {
  try {
    if (!title) return [];
    const lowerCaseTitle = title.toLowerCase();
    const allMovies = await db.movies.toArray();
    return allMovies.filter(movie => 
      movie.title.toLowerCase().includes(lowerCaseTitle)
    );
  } catch (error) {
    console.error('Error searching movies by title:', error);
    throw error;
  }
};

// Function to search movies by cast member
export const searchMoviesByCast = async (castName) => {
  try {
    if (!castName) return [];
    const lowerCaseName = castName.toLowerCase();
    const allMovies = await db.movies.toArray();
    return allMovies.filter(movie => 
      movie.cast.some(actor => 
        actor.toLowerCase().includes(lowerCaseName)
      )
    );
  } catch (error) {
    console.error('Error searching movies by cast:', error);
    throw error;
  }
};

// Function to get movies sorted by title
export const getMoviesSortedByTitle = async () => {
  try {
    const allMovies = await db.movies.toArray();
    return allMovies.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Error getting sorted movies:', error);
    throw error;
  }
};