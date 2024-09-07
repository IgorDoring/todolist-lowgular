export interface TaskResponse {
  is_completed: boolean;
  content: string;
  id: string;
  order: number;
  priority: number;
}

export interface TaskModel {
  isCompleted: boolean;
  content: string;
  id: string;
  order: number;
  priority: number;
}
