'use client'

import { useDeferredValue, useMemo } from 'react'
import { matchesTopic, topicLabels, type MarketStatus, type XKind } from '@/lib/catalog'
import { useElonverse } from './elonverse-provider'
import { MarketCard } from './market-card'

const listingFilters: { value: 'all' | MarketStatus; label: string }[] = [
  { value: 'all', label: 'All markets' },
  { value: 'listed', label: 'Listed markets' },
  { value: 'idea', label: 'Market ideas' },
]

const xFilters: { value: 'all' | XKind; label: string }[] = [
  { value: 'all', label: 'All X activity' },
  { value: 'tags', label: '@tags & #hashtags' },
  { value: 'volume', label: 'Post counts' },
  { value: 'products', label: 'Products' },
  { value: 'keywords', label: 'Keywords' },
]

export function MarketsSection() {
  const { markets, topic, listing, search, xKind, setListing, setSearch, setXKind } = useElonverse()
  const deferredSearch = useDeferredValue(search)
  const query = deferredSearch.toLowerCase().trim()
  const isXTopic = topic === 'x' || topic === 'mentions' || topic === 'posts'

  const shown = useMemo(
    () =>
      markets.filter(
        (m) =>
          matchesTopic(m, topic) &&
          (listing === 'all' || m.status === listing) &&
          (!(topic === 'x' || topic === 'mentions') || xKind === 'all' || m.xKind === xKind) &&
          [m.title, m.topic, m.venue, m.description].join(' ').toLowerCase().includes(query),
      ),
    [markets, topic, listing, xKind, query],
  )

  const title =
    topic === 'home' ? 'Price the possibility.' : topic === 'posts' ? 'Post count predictions.' : `${topicLabels[topic]} predictions.`
  const emptyText =
    topic === 'neuralink' && !query && listing === 'all'
      ? 'No Neuralink markets in this edition yet. Browse Home to explore the rest of the Elonverse.'
      : 'No matching markets. Try another topic, availability filter or search.'

  return (
    <section id="markets" className="markets-section" aria-labelledby="markets-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">01 / THE PREDICTIONS</span>
          <h2 id="markets-title">{title}</h2>
        </div>
      </div>
      <div className="market-controls">
        <div className="category-tabs" role="group" aria-label="Filter by market availability">
          {listingFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              className={listing === f.value ? 'active' : undefined}
              aria-pressed={listing === f.value}
              onClick={() => setListing(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search the Elonverse"
            aria-label="Search markets"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <div className="x-panel" hidden={!isXTopic}>
        <div className="x-heading">
          <div>
            <span className="eyebrow">@ELONMUSK / THE SIGNAL & THE NOISE</span>
            <h3>The feed is a market.</h3>
          </div>
          <span className="x-glyph" aria-hidden="true">
            @ #
          </span>
        </div>
        <p>
          How much will he post? What will he mention? Who gets tagged? Follow fixed windows, words, products and exact
          tags.
        </p>
        <div className="x-filters" role="group" aria-label="Filter X activity markets" hidden={topic === 'posts'}>
          {xFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              className={xKind === f.value ? 'active' : undefined}
              aria-pressed={xKind === f.value}
              hidden={topic === 'mentions' && f.value === 'volume'}
              onClick={() => setXKind(f.value)}
            >
              {f.value === 'all' && topic === 'mentions' ? 'All mentions' : f.label}
            </button>
          ))}
        </div>
        <small>
          {
            'Post-count listings follow each venue’s tracker rules. Mention proposals count posts containing Elon’s own text; repeated mentions within one post count once. Tags require an exact @handle or #hashtag.'
          }
        </small>
      </div>
      <p className="data-note">
        {'Polymarket odds refresh every minute. “Market idea” cards are proposals with no odds or trading yet.'}
      </p>
      <div className="market-grid" aria-live="polite">
        {shown.map((m) => (
          <MarketCard key={m.id} market={m} />
        ))}
      </div>
      <p className="empty" hidden={shown.length > 0}>
        {emptyText}
      </p>
    </section>
  )
}
