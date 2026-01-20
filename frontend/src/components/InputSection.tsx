interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onParse: () => void;
  disabled: boolean;
}

export default function InputSection({
  value,
  onChange,
  onParse,
  disabled,
}: InputSectionProps) {
  const charCount = value.length;
  const isValid = charCount >= 20;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="mb-4">
        <label
          htmlFor="input-text"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Input Text
        </label>
        <textarea
          id="input-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste your meeting notes, Slack conversation, or any unstructured text here (minimum 20 characters)..."
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`text-sm ${
            isValid ? "text-gray-600" : "text-red-600"
          }`}
        >
          {charCount} characters {!isValid && "(minimum 20 required)"}
        </span>
        <button
          onClick={onParse}
          disabled={!isValid || disabled}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {disabled ? "Parsing..." : "Parse"}
        </button>
      </div>
    </div>
  );
}

