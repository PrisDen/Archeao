"use client";

import { useState } from "react";
import { Task } from "@/types/api";
import TaskCard from "./TaskCard";

interface TasksListProps {
  tasks: Task[];
}

export default function TasksList({ tasks }: TasksListProps) {
  const [editedTasks, setEditedTasks] = useState<Task[]>(tasks);

  const handleTaskUpdate = (index: number, updatedTask: Task) => {
    const newTasks = [...editedTasks];
    newTasks[index] = updatedTask;
    setEditedTasks(newTasks);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Tasks</h2>
      <div className="space-y-4">
        {editedTasks.map((task, index) => (
          <TaskCard
            key={index}
            task={task}
            onUpdate={(updatedTask) => handleTaskUpdate(index, updatedTask)}
          />
        ))}
      </div>
    </div>
  );
}

