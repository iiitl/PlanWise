import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Todo } from "@/app/generated/prisma"

// Shared payload interfaces for create and update operations
export type CreateTodoPayload = Omit<Todo, "id" | "createdAt" | "updatedAt" | "userId">;
export type UpdateTodoPayload = Partial<CreateTodoPayload>;

export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: async (): Promise<Todo[]> => {
      const response = await fetch("/api/todos", {
        credentials: "include", // ✅ Send cookies
      });
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      return response.json();
    },
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    // Removed `any` and replaced with the new shared payload interface
    mutationFn: async (todoData: CreateTodoPayload) => {
      const response = await fetch("/api/todos", {
        method: "POST",
        credentials: "include", // ✅
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todoData),
      });
      if (!response.ok) {
        throw new Error("Failed to create todo");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    // Replaced Partial<Todo> with UpdateTodoPayload to prevent patching read-only fields
    mutationFn: async ({ id, data }: { id: string; data: UpdateTodoPayload }) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        credentials: "include", // ✅
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        credentials: "include", // ✅
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useCreateMultipleTodos() {
  const queryClient = useQueryClient();

  return useMutation({
    // Simplified using the newly created shared payload interface
    mutationFn: async (newTodos: CreateTodoPayload[]) => {
      const response = await fetch(`/api/todos/bulk`, {
        method: "POST",
        credentials: "include", // ✅
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todos: newTodos }),
      });
      if (!response.ok) {
        throw new Error("Failed to create multiple todos");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}