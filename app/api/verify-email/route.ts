import { connectMongo } from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

export async function GET(req: Request) {
  try {
    await connectMongo()
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/verified-success?status=error", req.url))
    }

    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.redirect(new URL("/verified-success?status=error", req.url))
    }

    const user = await User.findById(decoded.userId)

    if (!user) {
      return NextResponse.redirect(new URL("/verified-success?status=error", req.url))
    }

    if (user.verified) {
      return NextResponse.redirect(new URL("/verified-success?status=already-verified", req.url))
    }

    user.verified = true
    await user.save()

    return NextResponse.redirect(new URL("/verified-success?status=success", req.url))
  } catch (error: any) {
    console.error("Erro na verificação de e-mail:", error)
    return NextResponse.redirect(new URL("/verified-success?status=error", req.url))
  }
}
// This code handles the email verification process by checking the provided token,
// decoding it to find the user ID, and updating the user's verification status in the database.
// If successful, it redirects to a success page with the appropriate status. If any errors occur,
// it redirects to the same page with an error status. The JWT_SECRET is used to verify the token's authenticity.