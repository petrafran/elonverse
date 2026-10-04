'use client'

import { memo } from 'react'
import Image from 'next/image'
import { marketImage } from '@/lib/market-images'
import { probabilityText, type Market } from '@/lib/catalog'
import { marketTopic, TopicIcon } from './topic-icon'
import { useElonverse } from './elonverse-provider'

export const MarketCard = memo(function MarketCard({ market: m }: { market: Market }) {
  const { openMarket } = useElonverse()
  const isIdea = m.status === 'idea'
  const hasOdds = m.probability != null

  return (
    <article className="market-card">
      <div className="card-image">
        <Image
          src={marketImage(m.id).src}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        />
      </div>
      <div className="card-top">
        <span className="tag">{m.topic}</span>
        <span className="card-symbol" aria-hidden="true">
          <TopicIcon topic={marketTopic(m)} size={20} />
        </span>
      </div>
      <div className="card-body">
        <h3>{m.title}</h3>
        <p className="card-description">{m.description}</p>
        <div className="card-price">
          {hasOdds ? (
            <div>
              <strong>
                {probabilityText(m.probability as number)}
                <span>%</span>
              </strong>
              <small>{m.outcomeLabel || 'YES / IMPLIED PROBABILITY'}</small>
            </div>
          ) : (
            <div>
              <div className="idea-price">{isIdea ? 'A possibility to price.' : 'Odds unavailable.'}</div>
              <small>{isIdea ? 'PROPOSED · NO ODDS YET' : 'CHECK AT VENUE'}</small>
            </div>
          )}
          <small>{m.deadline}</small>
        </div>
        {hasOdds && (
          <div className="odds-track" aria-hidden="true">
            <span style={{ width: `${Math.max(0, Math.min(100, (m.probability as number) * 100))}%` }} />
          </div>
        )}
      </div>
      <div className="card-footer">
        <span className={`venue-badge${isIdea ? ' idea' : ''}`}>
          {m.venue}
          {isIdea ? ' / DRAFT' : m.live ? ' / LIVE' : ''}
        </span>
        <button type="button" onClick={() => openMarket(m.id)}>
          {isIdea ? 'View proposal' : 'View market'}
        </button>
      </div>
    </article>
  )
})
