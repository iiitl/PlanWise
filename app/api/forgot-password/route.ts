import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 })
    }

    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // 🔐 Always return generic response
    return NextResponse.json({
      message: "If an account exists, a reset link has been sent."
    })

  } catch {
    return NextResponse.json({
      message: "If an account exists, a reset link has been sent."
    })
  }
}