'use client'

import useSWR from 'swr'
import { formatPacific, type PerpMap } from '@/lib/catalog'
import { perpDefs, type PerpResponse } from '@/lib/perps'

const usdFormatters = new Map<number, Intl.NumberFormat>()
const usd = (n: unknown, digits: number) => {
  const value = Number(n)
  if (!Number.isFinite(value)) return '—'
  let formatter = usdFormatters.get(digits)
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits, minimumFractionDigits: digits })
    usdFormatters.set(digits, formatter)
  }
  return formatter.format(value)
}
const compactFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 })
const compactUSD = (n: unknown) => (Number.isFinite(Number(n)) ? compactFormatter.format(Number(n)) : '—')

const fetcher = async (url: string): Promise<PerpResponse> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Venue unavailable')
  return response.json()
}

export function PerpsSection({ snapshot, snapshotTime }: { snapshot: PerpMap; snapshotTime: string }) {
  const { data, error, isValidating, mutate } = useSWR('/api/perps', fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: false,
    keepPreviousData: true,
  })

  const perps: PerpMap = { ...snapshot, ...data?.perps }
  const count = data?.count ?? 0

  let status: string
  if (isValidating) status = data ? 'Refreshing venue data…' : 'Fetching venue data…'
  else if (error || (data && count === 0))
    status = 'Refresh unavailable. Displayed figures are the saved snapshot; confirm at the venue.'
  else if (data && count < perpDefs.length)
    status = `Partial update · ${count}/${perpDefs.length} contracts fetched; other figures may be older`
  else if (data) status = `Venue data · ${formatPacific(data.fetchedAt, { hour: 'numeric', minute: '2-digit' })} · refresh to update`
  else status = 'Fetching venue data…'

  return (
    <section id="perps" className="perps-section" aria-labelledby="perps-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">02 / THE CONTINUOUS BET</span>
          <h2 id="perps-title">
            Long the vision.
            <br />
            <i>Short the hype.</i>
          </h2>
        </div>
        <p>
          Prediction markets ask <em>will it happen?</em>
          <br />
          PERPs track <em>what is it worth?</em>
        </p>
      </div>
      <div className="perp-grid">
        {perpDefs.map((d) => {
          const p = perps[d.coin]
          const ticker = d.coin.split(':').pop()
          const pct = p && Number(p.prevDayPx) > 0 ? (Number(p.markPx) / Number(p.prevDayPx) - 1) * 100 : null
          return (
            <article className="perp-card" key={d.coin}>
              <div className="perp-top">
                <b>{ticker}–PERP</b>
                <span>{d.venue}</span>
              </div>
              <h3>{d.name}</h3>
              <div className="perp-mark">
                <strong>{p ? usd(p.markPx, d.coin === 'DOGE' ? 5 : 2) : '—'}</strong>
                <span className={`perp-change${pct != null && pct < 0 ? ' negative' : ''}`}>
                  {pct != null ? `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}% / 24h` : 'Venue data unavailable'}
                </span>
              </div>
              <div className="perp-metrics">
                <div>
                  <small>24H VOLUME</small>
                  <span>{p ? compactUSD(p.dayNtlVlm) : '—'}</span>
                </div>
                <div>
                  <small>FUNDING / HOUR</small>
                  <span>{p && Number.isFinite(Number(p.funding)) ? `${(Number(p.funding) * 100).toFixed(4)}%` : '—'}</span>
                </div>
              </div>
              <small className="perp-updated">
                {p
                  ? `Data: ${formatPacific(p._fetchedAt || snapshotTime, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
                  : 'Check current availability at venue'}
              </small>
              <a href={d.url} target="_blank" rel="noopener noreferrer">
                View {ticker} at venue
              </a>
            </article>
          )
        })}
      </div>
      <div className="perp-bottom">
        <span role="status">{status}</span>
        <button type="button" className="text-button" disabled={isValidating} onClick={() => mutate()}>
          Refresh prices
        </button>
      </div>
      <p className="perp-note">
        PERPs track asset prices and use funding and margin; they can liquidate. They do not confer stock ownership. DOGE
        is a culture connection, not a Musk company. Trading takes place at the linked venue.
      </p>
    </section>
  )
}
