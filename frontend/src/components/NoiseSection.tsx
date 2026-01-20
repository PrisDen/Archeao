"use client";

import { useState } from "react";
import { NoiseItem } from "@/types/api";

interface NoiseSectionProps {
  noise: NoiseItem[];
}

export default function NoiseSection({ noise }: NoiseSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-xl font-semibold text-gray-700">
          Noise ({noise.length})
        </h2>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {noise.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded p-3 border border-gray-200"
            >
              <p className="text-sm text-gray-600 italic mb-1">{item.text}</p>
              <p className="text-xs text-gray-500">Reason: {item.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

