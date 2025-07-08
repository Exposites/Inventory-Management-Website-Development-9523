import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getMoviesSortedByTitle } from '../db';

// Function to generate a PDF report of movies
export const generateMovieReport = async () => {
  try {
    // Get all movies sorted by title
    const movies = await getMoviesSortedByTitle();
    
    if (!movies || movies.length === 0) {
      throw new Error('No movies in collection to generate report.');
    }
    
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title to the document
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('DVD Collection Report', 105, 15, { align: 'center' });
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
    
    // Add collection stats
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total DVDs in Collection: ${movies.length}`, 14, 30);
    
    // Prepare data for table
    const tableData = movies.map(movie => {
      // Format the cast list to a string
      const castString = movie.cast && movie.cast.length > 0 
        ? movie.cast.slice(0, 3).join(', ') 
        : 'Not specified';
      
      // Format the release date
      const releaseDate = movie.releaseDate 
        ? new Date(movie.releaseDate).getFullYear() 
        : 'Not specified';
      
      return [
        movie.title,
        releaseDate,
        castString,
        movie.barcode || 'Not specified'
      ];
    });
    
    // Create table
    doc.autoTable({
      startY: 35,
      head: [['Title', 'Year', 'Main Cast', 'Barcode']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [102, 102, 241],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      columnStyles: {
        0: { cellWidth: 60 }, // Title
        1: { cellWidth: 20 }, // Year
        2: { cellWidth: 70 }, // Cast
        3: { cellWidth: 40 }, // Barcode
      }
    });
    
    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: 'right' });
    }
    
    // Save the PDF
    doc.save('DVD_Collection_Report.pdf');
    
    return { success: true };
  } catch (error) {
    console.error('Error generating report:', error);
    return { success: false, error: error.message };
  }
};