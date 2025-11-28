import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Numbered Pagination Component with ellipses
 * Props: currentPage, totalItems, itemsPerPage, onPageChange
 */
export default function NumberedPagination({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  if (totalItems === 0 || totalItems <= itemsPerPage) return null;

  const buildPageList = (total, current) => {
    const delta = 2; // neighbors
    const range = [];
    const rangeWithDots = [];
    let last = 0;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (last && i - last > 1) {
        // always use ellipses for gaps to keep the control compact
        rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      last = i;
    }

    return rangeWithDots;
  };

  const pageList = buildPageList(totalPages, currentPage);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-800">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-800">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-800">{totalItems}</span> entries
      </div>

      {/* Controls: allow horizontal scroll on very small screens, otherwise wrap buttons */}
      <div className="flex items-center gap-3 overflow-x-auto sm:overflow-visible">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">PREVIOUS</span>
        </button>

        <div className="flex items-center gap-2 bg-white p-1 rounded-md shadow-sm flex-wrap sm:flex-nowrap">
          {pageList.map((p, idx) => {
            if (p === '...') {
              return (
                <div key={`dots-${idx}`} className="px-2 py-1 text-xs sm:text-sm text-gray-500">
                  ...
                </div>
              );
            }

            const isActive = p === currentPage;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-2 py-1 sm:px-4 sm:py-2 text-center rounded-md text-xs sm:text-sm font-medium transition ${
                  isActive
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          <span className="hidden sm:inline">NEXT</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
