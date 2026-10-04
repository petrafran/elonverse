import { fetchOdds } from '@/lib/polymarket'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await fetchOdds()
  const count = Object.keys(data.odds).length
  return Response.json(data, {
    headers: {
      'Cache-Control': count ? 'public, s-maxage=30, stale-while-revalidate=60' : 'no-store',
    },
  })
}
