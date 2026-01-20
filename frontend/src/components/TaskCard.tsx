"use client";

import { useState } from "react";
import { Task, Priority, Domain } from "@/types/api";

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

const PRIORITY_COLORS = {
  P0: "bg-red-100 text-red-800 border-red-300",
  P1: "bg-orange-100 text-orange-800 border-orange-300",
  P2: "bg-yellow-100 text-yellow-800 border-yellow-300",
  P3: "bg-green-100 text-green-800 border-green-300",
};

const DOMAIN_COLORS = {
  frontend: "bg-blue-100 text-blue-800",
  backend: "bg-purple-100 text-purple-800",
  infra: "bg-gray-100 text-gray-800",
  data: "bg-indigo-100 text-indigo-800",
  product: "bg-pink-100 text-pink-800",
  design: "bg-cyan-100 text-cyan-800",
  qa: "bg-lime-100 text-lime-800",
  unknown: "bg-gray-100 text-gray-600",
};

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              className="w-full text-lg font-semibold text-gray-900 border border-gray-300 rounded px-2 py-1"
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-900">
              {task.title}
            </h3>
          )}
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="ml-2 text-sm text-blue-600 hover:text-blue-800"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {isEditing ? (
          <>
            <select
              value={editedTask.priority}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  priority: e.target.value as Priority,
                })
              }
              className="px-2 py-1 text-xs font-medium border rounded"
            >
              <option value="P0">P0</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
            <select
              value={editedTask.domain}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  domain: e.target.value as Domain,
                })
              }
              className="px-2 py-1 text-xs font-medium border rounded"
            >
              <option value="frontend">frontend</option>
              <option value="backend">backend</option>
              <option value="infra">infra</option>
              <option value="data">data</option>
              <option value="product">product</option>
              <option value="design">design</option>
              <option value="qa">qa</option>
              <option value="unknown">unknown</option>
            </select>
          </>
        ) : (
          <>
            <span
              className={`px-2 py-1 text-xs font-medium rounded border ${
                PRIORITY_COLORS[task.priority]
              }`}
            >
              {task.priority}
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                DOMAIN_COLORS[task.domain]
              }`}
            >
              {task.domain}
            </span>
          </>
        )}
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
          Complexity: {task.complexity}
        </span>
      </div>

      {isEditing ? (
        <textarea
          value={editedTask.description}
          onChange={(e) =>
            setEditedTask({ ...editedTask, description: e.target.value })
          }
          className="w-full text-sm text-gray-700 border border-gray-300 rounded px-2 py-1 mb-3 h-20 resize-none"
        />
      ) : (
        <p className="text-sm text-gray-700 mb-3">{task.description}</p>
      )}

      {task.owner_hint && (
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Owner:</span> {task.owner_hint}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-600">Confidence:</span>
        <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${task.confidence * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700">
          {Math.round(task.confidence * 100)}%
        </span>
      </div>

      {task.reasoning && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {showReasoning ? "Hide" : "Show"} reasoning
          </button>
          {showReasoning && (
            <p className="mt-2 text-sm text-gray-600 italic">
              {task.reasoning}
            </p>
          )}
        </div>
      )}

      {isEditing && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

