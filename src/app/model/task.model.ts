export interface TaskResponse {
  id: string;
  is_completed?: boolean;
  content: string;
  priority: number;
  url: string;
  created_at: string;
}

export interface TaskModel {
  id: string;
  isCompleted?: boolean;
  content: string;
  url: string;
  priority: number;
  createdAt: string;
}
