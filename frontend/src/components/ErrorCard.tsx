interface ErrorCardProps {
  message: string;
}

export default function ErrorCard({ message }: ErrorCardProps) {
  const showBackendHelp = message.includes("backend") || message.includes("connect");
  const showAPIHelp = message.includes("quota") || message.includes("API") || message.includes("500");

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
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-1">
            Parse Failed
          </h3>
          <p className="text-sm text-red-800 whitespace-pre-wrap">{message}</p>
          
          {showBackendHelp && (
            <div className="mt-4 p-3 bg-red-100 rounded text-xs text-red-800">
              <p className="font-semibold mb-1">Troubleshooting:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure backend is running: <code className="bg-red-200 px-1 rounded">uvicorn app.main:app --reload</code></li>
                <li>Check backend URL: <code className="bg-red-200 px-1 rounded">http://localhost:8000</code></li>
                <li>Verify CORS settings in backend/.env</li>
              </ul>
            </div>
          )}
          
          {showAPIHelp && (
            <div className="mt-4 p-3 bg-red-100 rounded text-xs text-red-800">
              <p className="font-semibold mb-1">API Issue:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check if API key is valid in backend/.env</li>
                <li>Verify API quota/rate limits</li>
                <li>Try again in a few minutes</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

