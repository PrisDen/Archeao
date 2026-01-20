export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-center mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">
          Parsing and validating output…
        </span>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-4/5 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-2/5"></div>
        </div>
      </div>
    </div>
  );
}

