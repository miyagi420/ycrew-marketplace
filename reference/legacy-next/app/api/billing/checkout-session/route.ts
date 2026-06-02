import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { plan, userType } = body

    // In production, this would create a Stripe checkout session
    // For now, return a mock response

    const priceMap: Record<string, number> = {
      "crew-pro": 999,
      "crew-elite": 2999,
      "owner-pro": 9900,
      "owner-enterprise": 29900,
    }

    const priceId = `${userType}-${plan}`
    const amount = priceMap[priceId] || 0

    return NextResponse.json({
      sessionId: "mock_session_id",
      url: "/checkout/success",
      amount,
      currency: "eur",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
