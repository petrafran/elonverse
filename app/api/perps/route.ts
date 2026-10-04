import { fetchPerps } from '@/lib/perps'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await fetchPerps()
  return Response.json(data, {
    headers: {
      'Cache-Control': data.count ? 'public, s-maxage=30, stale-while-revalidate=60' : 'no-store',
    },
  })
}
