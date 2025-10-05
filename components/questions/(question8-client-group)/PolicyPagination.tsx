// components/questions/(question8-client-group)/PolicyPagination.tsx

interface PolicyPaginationProps {
  currentPage: number;
  hasMore: boolean;
  isPending: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export default function PolicyPagination({
  currentPage,
  hasMore,
  isPending,
  onNext,
  onPrevious,
}: PolicyPaginationProps) {
  const isFirstPage = currentPage === 1;

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <button
        onClick={onPrevious}
        disabled={isFirstPage || isPending}
        className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-all ${
          isFirstPage || isPending ? "opacity-50 cursor-not-allowed" : ""
        } bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`}
      >
        ← Previous
      </button>

      <span className="text-sm text-gray-600 dark:text-gray-400">
        Page {currentPage}
      </span>

      <button
        onClick={onNext}
        disabled={!hasMore || isPending}
        className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-all ${
          !hasMore || isPending ? "opacity-50 cursor-not-allowed" : ""
        } bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700`}
      >
        Next →
      </button>
    </div>
  );
}
