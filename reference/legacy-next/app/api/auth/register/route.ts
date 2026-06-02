import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import type { Role } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, role } = body

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role.toUpperCase() as Role,
      },
    })

    // Create crew profile if role is CREW
    if (role.toUpperCase() === "CREW") {
      await prisma.crewProfile.create({
        data: {
          userId: user.id,
          name: "",
          primaryRole: "",
          secondaryRoles: [],
          languages: [],
          boatTypes: [],
        },
      })
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
