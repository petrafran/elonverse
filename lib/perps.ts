import type { PerpMap } from './catalog'

export const perpDefs = [
  { coin: 'xyz:TSLA', name: 'Tesla', venue: 'trade[XYZ]', url: 'https://app.hyperliquid.xyz/trade/xyz:TSLA', dex: 'xyz' },
  { coin: 'xyz:SPCX', name: 'SpaceX', venue: 'trade[XYZ]', url: 'https://app.hyperliquid.xyz/trade/xyz:SPCX', dex: 'xyz' },
  { coin: 'DOGE', name: 'Dogecoin', venue: 'Hyperliquid', url: 'https://app.hyperliquid.xyz/trade/DOGE', dex: '' },
] as const

export interface PerpResponse {
  perps: PerpMap
  count: number
  fetchedAt: string
}

interface UniverseEntry {
  name: string
  isDelisted?: boolean
}

async function fetchDex(dex: string): Promise<PerpMap> {
  const response = await fetch('https://api.hyperliquid.xyz/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'metaAndAssetCtxs', ...(dex ? { dex } : {}) }),
    signal: AbortSignal.timeout(10_000),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('Venue unavailable')
  const data = await response.json()
  if (!Array.isArray(data) || !Array.isArray(data[0]?.universe) || !Array.isArray(data[1])) {
    throw new Error('Unexpected venue response')
  }
  const fetchedAt = new Date().toISOString()
  const output: PerpMap = {}
  ;(data[0].universe as UniverseEntry[]).forEach((market, index) => {
    const context = data[1][index]
    if (perpDefs.some((d) => d.coin === market.name) && !market.isDelisted && context && Number(context.markPx) > 0) {
      output[market.name] = {
        funding: context.funding,
        prevDayPx: context.prevDayPx,
        dayNtlVlm: context.dayNtlVlm,
        markPx: context.markPx,
        _fetchedAt: fetchedAt,
      }
    }
  })
  return output
}

export async function fetchPerps(): Promise<PerpResponse> {
  const results = await Promise.allSettled([...new Set(perpDefs.map((d) => d.dex))].map(fetchDex))
  const perps: PerpMap = {}
  for (const result of results) {
    if (result.status === 'fulfilled') Object.assign(perps, result.value)
  }
  return { perps, count: Object.keys(perps).length, fetchedAt: new Date().toISOString() }
}
