import { Decision } from "@/types/api";

interface DecisionsListProps {
  decisions: Decision[];
}

export default function DecisionsList({ decisions }: DecisionsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Decisions</h2>
      <div className="space-y-4">
        {decisions.map((decision, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-gray-900 mb-2">{decision.statement}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Confidence:</span>
              <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${decision.confidence * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(decision.confidence * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

