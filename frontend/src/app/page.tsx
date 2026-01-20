"use client";

import { useState } from "react";
import { parseText } from "@/lib/api";
import { toMarkdown, toJSON } from "@/lib/markdown";
import { ParseResult } from "@/types/api";
import InputSection from "@/components/InputSection";
import OutputSection from "@/components/OutputSection";
import ErrorCard from "@/components/ErrorCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Toast from "@/components/Toast";

type State = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [state, setState] = useState<State>("idle");
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleParse = async () => {
    if (inputText.length < 20) return;

    setState("loading");
    setError(null);
    setResult(null);

    try {
      const parsed = await parseText(inputText);
      setResult(parsed);
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setState("error");
    }
  };

  const handleCopyMarkdown = () => {
    if (!result) return;
    const markdown = toMarkdown(result);
    navigator.clipboard.writeText(markdown);
    setToastMessage("Copied to clipboard");
  };

  const handleCopyJSON = () => {
    if (!result) return;
    const json = toJSON(result);
    navigator.clipboard.writeText(json);
    setToastMessage("Copied to clipboard");
  };

  const handleCloseToast = () => {
    setToastMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            The Meeting Archaeologist
          </h1>
          <p className="text-lg text-gray-600">
            Convert chaotic communication into execution-ready data
          </p>
        </header>

        <InputSection
          value={inputText}
          onChange={setInputText}
          onParse={handleParse}
          disabled={state === "loading"}
        />

        {state === "loading" && <LoadingSkeleton />}

        {state === "error" && error && <ErrorCard message={error} />}

        {state === "success" && result && (
          <OutputSection
            result={result}
            onCopyMarkdown={handleCopyMarkdown}
            onCopyJSON={handleCopyJSON}
          />
        )}

        {toastMessage && (
          <Toast message={toastMessage} onClose={handleCloseToast} />
        )}
      </div>
    </div>
  );
}

