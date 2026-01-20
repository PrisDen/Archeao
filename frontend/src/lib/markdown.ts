import { ParseResult } from "@/types/api";

export function toMarkdown(result: ParseResult): string {
  let md = "";

  if (result.decisions.length > 0) {
    md += "## Decisions\n\n";
    result.decisions.forEach((decision) => {
      const confidence = Math.round(decision.confidence * 100);
      md += `- ${decision.statement} (Confidence: ${confidence}%)\n`;
    });
    md += "\n";
  }

  if (result.tasks.length > 0) {
    md += "## Tasks\n\n";
    result.tasks.forEach((task) => {
      const confidence = Math.round(task.confidence * 100);
      md += `- [${task.priority}][${task.domain}][${task.complexity}] ${task.title}\n`;
      md += `  Description: ${task.description}\n`;
      if (task.owner_hint) {
        md += `  Owner: ${task.owner_hint}\n`;
      }
      md += `  Confidence: ${confidence}%\n`;
      if (task.reasoning) {
        md += `  Reasoning: ${task.reasoning}\n`;
      }
      md += "\n";
    });
  }

  return md.trim();
}

export function toJSON(result: ParseResult): string {
  return JSON.stringify(result, null, 2);
}

