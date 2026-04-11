import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Bulk create schema
const BulkCreateSchema = z.array(
  z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    estimatedTime: z.number().int().positive().optional(),
    isAiSuggested: z.boolean().default(false),
  }),
);

// Bulk update schema
const BulkUpdateSchema = z.object({
  todoIds: z.array(z.string()),
  updates: z.object({
    isCompleted: z.boolean().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    dueDate: z.string().datetime().optional(),
    isAiSuggested: z.boolean().optional(),
  }),
});

// -------------------- BULK CREATE --------------------
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token?.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body;

    // ✅ Safe JSON parsing
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const todosArray = body.todos;

    const parsed = BulkCreateSchema.safeParse(todosArray);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    // ✅ Convert dueDate → Date
    const todos = await prisma.todo.createMany({
      data: parsed.data.map((todo) => ({
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        estimatedTime: todo.estimatedTime,
        isAiSuggested: todo.isAiSuggested,
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        userId: token.sub as string,
      })),
    });

    return NextResponse.json(todos, { status: 201 });
  } catch (error) {
    console.error("POST /api/todos/bulk error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// -------------------- BULK UPDATE --------------------
export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token?.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body;

    // ✅ Safe JSON parsing
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const parsed = BulkUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { todoIds, updates } = parsed.data;

    const result = await prisma.todo.updateMany({
      where: {
        id: { in: todoIds },
        userId: token.sub as string,
      },
      data: {
        ...updates,
        dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
        completedAt: updates.isCompleted ? new Date() : null,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT /api/todos/bulk error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}