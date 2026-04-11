import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    // 1. Validate input
    if (!token || !password) {
      return NextResponse.json(
        { message: "Invalid request. Missing token or password." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 2. Find token in DB
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    // 3. Check token validity
    if (!record) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 400 }
      );
    }

    if (record.expiresAt < new Date()) {
      // Auto-delete expired token
      await prisma.passwordResetToken.delete({
        where: { token },
      });
      
      return NextResponse.json(
        { message: "Token has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Update user password
    await prisma.user.update({
      where: { email: record.email },
      data: { password: hashedPassword },
    });

    // 6. Delete used token
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    console.log(`Password reset successful for ${record.email}`);

    return NextResponse.json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
