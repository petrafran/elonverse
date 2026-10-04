import type { PerpMap } from './catalog'

const REFERRAL = '7504273Q'
const lighterURL = (symbol: string) => `https://app.lighter.xyz/trade/${symbol}?referral=${REFERRAL}`
const LIGHTER_API = 'https://mainnet.zklighter.elliot.ai/api/v1'

export const perpDefs = [
  { coin: 'SPCX', name: 'SpaceX', venue: 'Lighter', url: lighterURL('SPCX'), marketId: 194, digits: 2 },
  { coin: 'TSLA', name: 'Tesla', venue: 'Lighter', url: lighterURL('TSLA'), marketId: 112, digits: 2 },
  { coin: 'DOGE', name: 'Dogecoin', venue: 'Lighter', url: lighterURL('DOGE'), marketId: 3, digits: 5 },
] as const

export interface PerpResponse {
  perps: PerpMap
  count: number
  fetchedAt: string
}

interface LighterMarket {
  symbol: string
  market_id: number
  status: string
  mark_price?: string
  last_trade_price?: number
  daily_price_change?: number
  daily_quote_token_volume?: number
}

interface LighterFunding {
  market_id: number
  exchange: string
  rate: number
}

async function getJSON<T>(url: string): Promise<T> {
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000), cache: 'no-store' })
  if (!response.ok) throw new Error('Venue unavailable')
  return response.json()
}

async function fetchMarket(marketId: number) {
  const data = await getJSON<{ order_book_details?: LighterMarket[] }>(`${LIGHTER_API}/orderBookDetails?market_id=${marketId}`)
  return data.order_book_details?.[0]
}

export async function fetchPerps(): Promise<PerpResponse> {
  const [fundingResult, ...marketResults] = await Promise.allSettled([
    getJSON<{ funding_rates?: LighterFunding[] }>(`${LIGHTER_API}/funding-rates`),
    ...perpDefs.map((d) => fetchMarket(d.marketId)),
  ])
  const funding =
    fundingResult.status === 'fulfilled'
      ? (fundingResult.value as { funding_rates?: LighterFunding[] }).funding_rates?.filter((f) => f.exchange === 'lighter') ?? []
      : []
  const fetchedAt = new Date().toISOString()
  const perps: PerpMap = {}

  marketResults.forEach((result, i) => {
    const def = perpDefs[i]
    if (result.status !== 'fulfilled') return
    const market = result.value as LighterMarket | undefined
    const mark = Number(market?.mark_price ?? market?.last_trade_price)
    if (!market || market.status !== 'active' || !(mark > 0)) return
    const change = Number(market.daily_price_change)
    perps[def.coin] = {
      markPx: String(mark),
      prevDayPx: Number.isFinite(change) ? String(mark / (1 + change / 100)) : undefined,
      dayNtlVlm: market.daily_quote_token_volume != null ? String(market.daily_quote_token_volume) : undefined,
      funding: funding.find((f) => f.market_id === def.marketId)?.rate?.toString(),
      _fetchedAt: fetchedAt,
    }
  })

  return { perps, count: Object.keys(perps).length, fetchedAt }
}
