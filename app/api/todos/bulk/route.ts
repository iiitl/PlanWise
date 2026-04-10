import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Zod schema for validating bulk todo creation input
const BulkCreateSchema = z.array(
  z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    estimatedTime: z.number().int().positive().optional(),
    isAiSuggested: z.boolean().default(false),
  }),
);

// Zod schema for validating bulk todo update input
const BulkUpdateSchema = z.object({
  todoIds: z.array(z.string()),
  updates: z.object({
    isCompleted: z.boolean().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    dueDate: z.string().datetime().optional(),
    isAiSuggested: z.boolean().optional(),
  }),
});

// POST /api/todos/bulk
export async function POST(request: NextRequest) {
  console.log("\n--- [POST /api/todos/bulk] Handler Triggered ---");

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;

  // ✅ Handle malformed JSON
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON format" },
      { status: 400 }
    );
  }

  try {
    const todosArray = body.todos;

    const parsedBody = BulkCreateSchema.safeParse(todosArray);

    // ✅ Standard validation response
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsedBody.error.issues,
        },
        { status: 400 }
      );
    }

    const todos = await prisma.todo.createMany({
      data: parsedBody.data.map((todo) => ({
        ...todo,
        userId: token.sub as string,
      })),
    });

    return NextResponse.json(todos, { status: 201 });

  } catch (error) {
    console.error("Bulk create error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/todos/bulk
export async function PUT(request: NextRequest) {
  console.log("\n--- [PUT /api/todos/bulk] Handler Triggered ---");

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;

  // ✅ Handle malformed JSON
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON format" },
      { status: 400 }
    );
  }

  try {
    const parsedBody = BulkUpdateSchema.safeParse(body);

    // ✅ Standard validation response
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsedBody.error.issues,
        },
        { status: 400 }
      );
    }

    const { todoIds, updates } = parsedBody.data;

    const result = await prisma.todo.updateMany({
      where: {
        id: { in: todoIds },
        userId: token.sub as string,
      },
      data: {
        ...updates,
        completedAt: updates.isCompleted ? new Date() : null,
      },
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error("Bulk update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}