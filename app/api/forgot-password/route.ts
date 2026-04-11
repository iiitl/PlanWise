import { NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // 1. Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      );
    }

    const genericResponse = NextResponse.json({
      message: "If this email exists, a reset link has been sent.",
    });

    // 2. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. If user exists -> generate token + send email
    if (user) {
      // Generate token
      const token = crypto.randomBytes(32).toString("hex");

      // Expiry (1 hour)
      const expiry = new Date(Date.now() + 60 * 60 * 1000);

      // Save token in DB, clearing existing ones for this email first
      await prisma.passwordResetToken.deleteMany({
        where: { email },
      });

      await prisma.passwordResetToken.create({
        data: {
          email,
          token,
          expiresAt: expiry,
        },
      });

      // Create reset link (fallback if env missing)
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const resetLink = `${baseUrl}/reset-password?token=${token}`;

      // Send email
      const result = await resend.emails.send({
        from: "PlanWise <onboarding@resend.dev>",
        to: email,
        subject: "Reset your password",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
            <p style="color: #555; text-align: center; margin-bottom: 20px;">
              We received a request to reset your password. Click the button below to choose a new one:
            </p>
            <div style="text-align: center;">
              <a href="${resetLink}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                 Reset Password
              </a>
            </div>
            <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
              If you didn't request this, you can safely ignore this email.
            </p>
            <p style="color: #777; font-size: 12px; text-align: center; margin-top: 10px;">
              This link will expire in 1 hour.
            </p>
          </div>
        `,
      });

      // CRITICAL: Log the result for debugging
      console.log("EMAIL RESULT:", result);

      if (result.error) {
        console.error("Resend delivery failed:", result.error);
        // Even if email fails, return generic response to prevent user enumeration
      }
    }

    // 4. Always return generic response (security)
    return genericResponse;

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error); 

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}