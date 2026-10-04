'use client'

import { useEffect, useRef } from 'react'
import { formatPacific, probabilityText, safeURL } from '@/lib/catalog'
import { useElonverse } from './elonverse-provider'

export function MarketDialog() {
  const { markets, openMarketId, closeMarket } = useElonverse()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const m = openMarketId ? markets.find((x) => x.id === openMarketId) : undefined

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (m && !dialog.open) dialog.showModal()
    if (!m && dialog.open) dialog.close()
  }, [m])

  const draft = m?.status === 'idea'

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="dialog-title"
      onClose={closeMarket}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return
        const r = e.currentTarget.getBoundingClientRect()
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.currentTarget.close()
      }}
    >
      <button type="button" className="dialog-close" aria-label="Close market details" onClick={() => dialogRef.current?.close()}>
        ×
      </button>
      {m && (
        <div id="dialog-content">
          <span className="eyebrow">
            {m.topic} / {draft ? 'PROPOSED MARKET' : 'PROVIDER LISTING'}
          </span>
          <h2 id="dialog-title">{m.title}</h2>
          <p>{m.description}</p>
          {m.probability != null && (
            <p>
              <strong>
                {probabilityText(m.probability)}% {m.outcomeLabel || 'Yes'}
              </strong>{' '}
              · provider snapshot, not an executable quote
            </p>
          )}
          <h3>{draft ? 'Proposed resolution criteria' : 'Rule summary · confirm at provider'}</h3>
          <p>
            {m.rules ||
              'Read the provider’s exact rules and current trading status before taking a position. This research snapshot is not a substitute for those rules.'}
          </p>
          {m.outcomes && (
            <>
              <h3>Outcomes</h3>
              <ul>
                {m.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </>
          )}
          <h3>Deadline</h3>
          <p>{m.deadline}</p>
          {m.url && (
            <a className="dialog-action" href={safeURL(m.url)} target="_blank" rel="noopener noreferrer">
              Open on {m.venue}
            </a>
          )}
          {m.source && (
            <a href={safeURL(m.source)} target="_blank" rel="noopener noreferrer">
              {draft ? 'Background source' : 'Provider rules & evidence'}
            </a>
          )}
          <div className="dialog-provenance">
            {draft
              ? 'Draft proposal. Not created or funded. Final source and duplicate checks are required before launch.'
              : `Checked ${m.checkedAt ? formatPacific(m.checkedAt, {}) : 'October 2, 2026'}. Odds and availability may have changed.`}
          </div>
        </div>
      )}
    </dialog>
  )
}
