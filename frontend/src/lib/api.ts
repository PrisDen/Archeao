import { ParseRequest, ParseResult } from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function parseText(rawText: string): Promise<ParseResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/parse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw_text: rawText } as ParseRequest),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to parse text");
  }

  return response.json();
}

