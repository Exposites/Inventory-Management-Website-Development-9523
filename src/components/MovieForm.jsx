import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { addMovie } from '../db';

const { FiSave, FiX, FiPlus, FiMinus } = FiIcons;

const MovieForm = ({ movie, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    releaseDate: '',
    cast: [''],
    barcode: '',
    posterPath: '',
    overview: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Initialize form with movie data if provided
  useEffect(() => {
    if (movie) {
      setFormData({
        ...movie,
        releaseDate: movie.releaseDate ? movie.releaseDate.split('T')[0] : '',
        cast: movie.cast && movie.cast.length > 0 ? movie.cast : ['']
      });
    }
  }, [movie]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleCastChange = (index, value) => {
    const newCast = [...formData.cast];
    newCast[index] = value;
    
    setFormData(prev => ({
      ...prev,
      cast: newCast
    }));
  };
  
  const addCastMember = () => {
    setFormData(prev => ({
      ...prev,
      cast: [...prev.cast, '']
    }));
  };
  
  const removeCastMember = (index) => {
    if (formData.cast.length > 1) {
      const newCast = [...formData.cast];
      newCast.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        cast: newCast
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.barcode.trim()) {
      newErrors.barcode = 'Barcode is required';
    }
    
    // Filter out empty cast members
    const nonEmptyCast = formData.cast.filter(member => member.trim());
    if (nonEmptyCast.length === 0) {
      newErrors.cast = 'At least one cast member is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Filter out empty cast members
      const processedFormData = {
        ...formData,
        cast: formData.cast.filter(member => member.trim())
      };
      
      // Save to database
      const id = await addMovie(processedFormData);
      
      // Call the onSave callback with the saved data
      if (onSave) {
        onSave({
          ...processedFormData,
          id
        });
      }
    } catch (error) {
      console.error('Error saving movie:', error);
      setErrors(prev => ({
        ...prev,
        form: 'Failed to save movie. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {errors.form}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Movie Title*
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Barcode*
        </label>
        <input
          type="text"
          name="barcode"
          value={formData.barcode}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.barcode ? 'border-red-300' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        />
        {errors.barcode && (
          <p className="mt-1 text-sm text-red-600">{errors.barcode}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Release Date
        </label>
        <input
          type="date"
          name="releaseDate"
          value={formData.releaseDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Poster URL
        </label>
        <input
          type="url"
          name="posterPath"
          value={formData.posterPath}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Overview
        </label>
        <textarea
          name="overview"
          value={formData.overview}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Cast*
          </label>
          <button
            type="button"
            onClick={addCastMember}
            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
          >
            <SafeIcon icon={FiPlus} className="mr-1" />
            Add
          </button>
        </div>
        
        {errors.cast && (
          <p className="mt-1 text-sm text-red-600">{errors.cast}</p>
        )}
        
        <div className="space-y-2">
          {formData.cast.map((member, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={member}
                onChange={(e) => handleCastChange(index, e.target.value)}
                placeholder="Actor/Actress name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {formData.cast.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCastMember(index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <SafeIcon icon={FiMinus} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
            disabled={isSubmitting}
          >
            <SafeIcon icon={FiX} className="mr-2" />
            Cancel
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          disabled={isSubmitting}
        >
          <SafeIcon icon={FiSave} className="mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Movie'}
        </motion.button>
      </div>
    </form>
  );
};

export default MovieForm;