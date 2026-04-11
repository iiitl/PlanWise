import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const TodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  estimatedTime: z.number().int().positive().optional(),
});

export async function GET(request: NextRequest) {
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

    const todos = await prisma.todo.findMany({
      where: { userId: token.sub },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error("GET /api/todos error:", error);

    // ✅ Generic safe response (same pattern needed for forgot-password)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// -------------------- CREATE TODO --------------------
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

    const parsed = TodoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" }, // ✅ no detailed leak
        { status: 400 }
      );
    }

    const data = parsed.data;

    const todo = await prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        estimatedTime: data.estimatedTime,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        userId: token.sub,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("POST /api/todos error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}