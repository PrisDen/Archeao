export type Priority = "P0" | "P1" | "P2" | "P3";

export type Domain =
  | "frontend"
  | "backend"
  | "infra"
  | "data"
  | "product"
  | "design"
  | "qa"
  | "unknown";

export type Complexity = 1 | 2 | 3 | 5 | 8 | 13;

export interface Decision {
  statement: string;
  confidence: number;
}

export interface Task {
  title: string;
  description: string;
  priority: Priority;
  complexity: Complexity;
  domain: Domain;
  owner_hint: string | null;
  confidence: number;
  reasoning: string | null;
}

export interface NoiseItem {
  text: string;
  reason: string;
}

export interface ParseResult {
  decisions: Decision[];
  tasks: Task[];
  noise: NoiseItem[];
  meta: {
    input_length: number;
    retry_count: number;
    model: string;
    processing_time_ms: number;
  };
}

export interface ParseRequest {
  raw_text: string;
}

