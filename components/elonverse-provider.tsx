'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { topicLabels, type Market, type MarketStatus, type Topic, type XKind } from '@/lib/catalog'

type Listing = 'all' | MarketStatus
type XFilter = 'all' | XKind

interface ElonverseContextValue {
  markets: Market[]
  topic: Topic
  listing: Listing
  search: string
  xKind: XFilter
  openMarketId: string | null
  setTopic: (topic: Topic) => void
  setListing: (listing: Listing) => void
  setSearch: (search: string) => void
  setXKind: (xKind: XFilter) => void
  openMarket: (id: string) => void
  closeMarket: () => void
  scrollToMarkets: () => void
}

const ElonverseContext = createContext<ElonverseContextValue | null>(null)

export function useElonverse() {
  const value = useContext(ElonverseContext)
  if (!value) throw new Error('useElonverse must be used within ElonverseProvider')
  return value
}

const searchCategories = ['all', 'space', 'machines', 'ai', 'x', 'ideas', 'culture']

export function ElonverseProvider({ markets, children }: { markets: Market[]; children: ReactNode }) {
  const [topic, setTopicState] = useState<Topic>('home')
  const [listing, setListing] = useState<Listing>('all')
  const [search, setSearch] = useState('')
  const [xKind, setXKind] = useState<XFilter>('all')
  const [openMarketId, setOpenMarketId] = useState<string | null>(null)

  const setTopic = useCallback((value: Topic) => {
    if (!(value in topicLabels)) return
    setTopicState(value)
    setListing('all')
    setSearch('')
    setXKind('all')
  }, [])

  const openMarket = useCallback((id: string) => setOpenMarketId(id), [])
  const closeMarket = useCallback(() => setOpenMarketId(null), [])
  const scrollToMarkets = useCallback(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('markets')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' })
  }, [])

  const marketsRef = useRef(markets)
  marketsRef.current = markets

  useEffect(() => {
    const modelContext = (document as unknown as { modelContext?: { registerTool: (tool: unknown, opts: unknown) => unknown } }).modelContext
    if (!modelContext?.registerTool) return
    const lifecycle = new AbortController()
    const register = (tool: unknown) => {
      try {
        Promise.resolve(modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => {})
      } catch {}
    }
    register({
      name: 'search_elonverse_markets',
      title: 'Search Elonverse markets',
      description:
        'Read the catalog of provider snapshots and proposed markets. Returns relevant questions, their provenance and links without placing trades.',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' }, category: { type: 'string', enum: searchCategories } },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute(input: { query?: unknown; category?: unknown }) {
        if (
          !input ||
          typeof input !== 'object' ||
          Array.isArray(input) ||
          Object.keys(input).some((k) => !['query', 'category'].includes(k)) ||
          ('query' in input && typeof input.query !== 'string') ||
          ('category' in input && !searchCategories.includes(input.category as string))
        ) {
          throw new Error('Provide a text query and a supported category.')
        }
        const query = typeof input.query === 'string' ? input.query.toLowerCase() : ''
        return marketsRef.current
          .filter(
            (m) =>
              (!input.category || input.category === 'all' || m.category === input.category) &&
              (!query || [m.title, m.topic, m.venue].join(' ').toLowerCase().includes(query)),
          )
          .map(({ id, title, status, venue, deadline, probability, outcomeLabel, url, checkedAt }) => ({
            id, title, status, venue, deadline, probability, outcomeLabel, url, checkedAt,
          }))
      },
    })
    register({
      name: 'show_elonverse_market',
      title: 'Show market details',
      description:
        'Open the same market details shown by View market or View proposal. Navigates locally; does not create a market or trade.',
      inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute(input: { id?: unknown }) {
        if (
          !input ||
          typeof input !== 'object' ||
          Object.keys(input).length !== 1 ||
          typeof input.id !== 'string' ||
          !marketsRef.current.some((m) => m.id === input.id)
        ) {
          throw new Error('Unknown market id.')
        }
        setOpenMarketId(input.id)
        return { id: input.id, detailsOpen: true }
      },
    })
    return () => lifecycle.abort()
  }, [])

  const value = useMemo<ElonverseContextValue>(
    () => ({
      markets, topic, listing, search, xKind, openMarketId,
      setTopic, setListing, setSearch, setXKind, openMarket, closeMarket, scrollToMarkets,
    }),
    [markets, topic, listing, search, xKind, openMarketId, setTopic, openMarket, closeMarket, scrollToMarkets],
  )

  return <ElonverseContext.Provider value={value}>{children}</ElonverseContext.Provider>
}
