interface MetaPanelProps {
  meta: {
    input_length: number;
    retry_count: number;
    model: string;
    processing_time_ms: number;
  };
}

export default function MetaPanel({ meta }: MetaPanelProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Processing Info
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Input Length:</span>
          <span className="ml-2 font-medium text-gray-900">
            {meta.input_length}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Retries:</span>
          <span className="ml-2 font-medium text-gray-900">
            {meta.retry_count}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Processing Time:</span>
          <span className="ml-2 font-medium text-gray-900">
            {meta.processing_time_ms}ms
          </span>
        </div>
        <div className="col-span-2 md:col-span-1">
          <span className="text-gray-600">Model:</span>
          <span className="ml-2 font-medium text-gray-900 text-xs">
            {meta.model}
          </span>
        </div>
      </div>
    </div>
  );
}

