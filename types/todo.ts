export interface CreateTodoPayload {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: string;
  dueDate?: string;
}

export interface UpdateTodoPayload {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface ApiError {
  message: string;
}