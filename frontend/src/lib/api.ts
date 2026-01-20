import { ParseRequest, ParseResult } from "@/types/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function parseText(rawText: string): Promise<ParseResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/parse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw_text: rawText } as ParseRequest),
    });

    if (!response.ok) {
      let errorMessage = "Unable to process input";
      
      try {
        const errorData = await response.json();
        if (errorData.detail?.user_message) {
          errorMessage = errorData.detail.user_message;
        } else if (errorData.detail?.message) {
          errorMessage = errorData.detail.message;
        } else if (errorData.user_message) {
          errorMessage = errorData.user_message;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        if (response.status === 500) {
          errorMessage = "LLM unavailable or parsing failed";
        } else if (response.status === 503) {
          errorMessage = "The backend service is temporarily unavailable. Please try again later.";
        } else {
          errorMessage = "Unable to process input";
        }
      }
      
      throw new Error(`Parsing error: ${errorMessage}`);
    }

    return response.json();
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("fetch") || err.name === "TypeError") {
        throw new Error("Cannot connect to backend. Please ensure the server is running.");
      }
      throw err;
    }
    throw new Error("Parsing error: Unable to process input");
  }
}

