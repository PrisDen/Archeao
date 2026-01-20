import { ParseResult } from "@/types/api";
import DecisionsList from "./DecisionsList";
import TasksList from "./TasksList";
import NoiseSection from "./NoiseSection";
import MetaPanel from "./MetaPanel";

interface OutputSectionProps {
  result: ParseResult;
  onCopyMarkdown: () => void;
  onCopyJSON: () => void;
}

export default function OutputSection({
  result,
  onCopyMarkdown,
  onCopyJSON,
}: OutputSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          onClick={onCopyMarkdown}
          className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Copy as Markdown
        </button>
        <button
          onClick={onCopyJSON}
          className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Copy JSON
        </button>
      </div>

      {result.decisions.length > 0 && (
        <DecisionsList decisions={result.decisions} />
      )}

      {result.tasks.length > 0 && <TasksList tasks={result.tasks} />}

      {result.noise.length > 0 && <NoiseSection noise={result.noise} />}

      <MetaPanel meta={result.meta} />
    </div>
  );
}

