import { catalog } from './catalog'

export const POLYMARKET_REFERRAL = 'mtsmarkets'
export const polymarketURL = (eventSlug: string) =>
  `https://polymarket.com/event/${eventSlug}?r=${POLYMARKET_REFERRAL}`

export interface LiveOdds {
  probability: number
  outcomeLabel?: string
  closed: boolean
}

export interface OddsResponse {
  odds: Record<string, LiveOdds>
  fetchedAt: string
}

interface GammaMarket {
  slug: string
  groupItemTitle?: string
  outcomePrices?: string
  closed?: boolean
  active?: boolean
}

interface GammaEvent {
  slug: string
  closed?: boolean
  markets?: GammaMarket[]
}

const yesPrice = (m: GammaMarket) => {
  try {
    const value = Number(JSON.parse(m.outcomePrices ?? '[]')[0])
    return Number.isFinite(value) ? value : null
  } catch {
    return null
  }
}

async function fetchEvent(slug: string): Promise<GammaEvent | undefined> {
  const response = await fetch(`https://gamma-api.polymarket.com/events?slug=${encodeURIComponent(slug)}`, {
    signal: AbortSignal.timeout(8_000),
    next: { revalidate: 60 },
  })
  if (!response.ok) throw new Error('Polymarket unavailable')
  const events: GammaEvent[] = await response.json()
  return events[0]
}

export async function fetchOdds(): Promise<OddsResponse> {
  const live = catalog.markets.filter((m) => m.eventSlug)
  const events = await Promise.allSettled(live.map((m) => fetchEvent(m.eventSlug as string)))
  const odds: Record<string, LiveOdds> = {}

  events.forEach((result, i) => {
    const market = live[i]
    if (result.status !== 'fulfilled' || !result.value?.markets?.length) return
    const outcomes = result.value.markets
    if (market.marketSlug) {
      const match = outcomes.find((o) => o.slug === market.marketSlug)
      const price = match && yesPrice(match)
      if (match && price != null) odds[market.id] = { probability: price, closed: Boolean(match.closed) }
      return
    }
    const leader = outcomes
      .filter((o) => !o.closed)
      .map((o) => ({ o, price: yesPrice(o) }))
      .filter((x): x is { o: GammaMarket; price: number } => x.price != null)
      .sort((a, b) => b.price - a.price)[0]
    if (leader) {
      odds[market.id] = {
        probability: leader.price,
        outcomeLabel: outcomes.length > 1 && leader.o.groupItemTitle ? `${leader.o.groupItemTitle.toUpperCase()} · LEADING` : undefined,
        closed: false,
      }
    }
  })

  return { odds, fetchedAt: new Date().toISOString() }
}
