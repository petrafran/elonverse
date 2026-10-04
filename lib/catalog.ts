import catalogJson from './catalog.json'

export type MarketCategory = 'space' | 'machines' | 'ai' | 'ideas' | 'culture' | 'x'
export type XKind = 'tags' | 'volume' | 'products' | 'keywords'
export type MarketStatus = 'listed' | 'idea'

export interface Market {
  id: string
  category: MarketCategory
  topic: string
  title: string
  description: string
  deadline: string
  rules?: string
  status: MarketStatus
  venue: string
  url?: string
  source?: string
  checkedAt?: string
  probability?: number | null
  outcomeLabel?: string
  outcomes?: string[]
  reference?: string
  xKind?: XKind
  eventSlug?: string
  marketSlug?: string
  live?: boolean
}

export interface PerpContext {
  funding?: string
  prevDayPx?: string
  dayNtlVlm?: string
  markPx?: string
  _fetchedAt?: string
}

export type PerpMap = Record<string, PerpContext>

interface Catalog {
  snapshotLabel: string
  checkedAt: string
  perpCheckedAt: string
  perps: PerpMap
  markets: Market[]
}

export const catalog = catalogJson as unknown as Catalog

export const topicLabels = {
  home: 'Home',
  neuralink: 'Neuralink',
  spacex: 'SpaceX',
  grok: 'Grok Bot',
  mentions: 'Mentions',
  tesla: 'Tesla',
  hyperloop: 'Hyperloop',
  posts: 'Post counts',
  x: 'X activity',
  culture: 'Culture',
  ideas: 'Big ideas',
} as const

export type Topic = keyof typeof topicLabels

const topicPatterns: Partial<Record<Topic, RegExp>> = {
  neuralink: /neuralink/i,
  spacex: /spacex|starship/i,
  tesla: /tesla|optimus|robotaxi|roadster/i,
  hyperloop: /hyperloop/i,
}

export function matchesTopic(market: Market, topic: Topic) {
  const subject = `${market.topic} ${market.title}`
  switch (topic) {
    case 'home':
      return true
    case 'mentions':
      return market.category === 'x' && ['tags', 'keywords', 'products'].includes(market.xKind ?? '')
    case 'posts':
      return market.category === 'x' && market.xKind === 'volume'
    case 'x':
      return market.category === 'x'
    case 'grok':
      return market.category === 'ai' && /grok/i.test(subject)
    case 'ideas':
    case 'culture':
      return market.category === topic
    default:
      return topicPatterns[topic]?.test(subject) ?? false
  }
}

export const probabilityText = (p: number) => String(Number((p * 100).toFixed(1)))

export function safeURL(url?: string) {
  if (!url) return '#'
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' ? parsed.href : '#'
  } catch {
    return '#'
  }
}

export const formatPacific = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString('en-US', { timeZone: 'America/Los_Angeles', timeZoneName: 'short', ...options })
