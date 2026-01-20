interface ErrorCardProps {
  message: string;
}

export default function ErrorCard({ message }: ErrorCardProps) {
  return (
    <div className="bg-red-50 border border-red-300 rounded-lg p-6">
      <div className="flex items-start">
        <svg
          className="w-6 h-6 text-red-600 mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="text-lg font-semibold text-red-900 mb-1">
            Parse Failed
          </h3>
          <p className="text-sm text-red-800">{message}</p>
        </div>
      </div>
    </div>
  );
}

