import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json(
    {
      error: 'Gone',
      message:
        'This endpoint has been removed. Use /api/markets/arbitrage or /api/markets/movers at https://musashi-api.vercel.app.',
      docs: 'https://musashi.bot/docs/polymarket-api',
    },
    { status: 410 }
  )
}
