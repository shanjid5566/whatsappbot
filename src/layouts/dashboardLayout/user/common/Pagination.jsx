import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Common Pagination Component
 * @param {number} currentPage - Current active page (1-based)
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Items to show per page (default: 4)
 * @param {function} onPageChange - Callback when page changes
 */
export default function Pagination({ 
  currentPage = 1, 
  totalItems = 0, 
  itemsPerPage = 4, 
  onPageChange 
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Calculate the range of items being displayed
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Don't render pagination if there are no items or items are less than or equal to itemsPerPage
  if (totalItems === 0 || totalItems <= itemsPerPage) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
      {/* Showing X to Y of Z entries */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-800">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-800">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-800">{totalItems}</span> entries
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`
            flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition
            ${currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }
          `}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {/* Current Page Number Only */}
        <div className="flex items-center justify-center min-w-[40px] px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#CB3CDF] to-[#B127C1] text-white">
          {currentPage}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`
            flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition
            ${currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }
          `}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
