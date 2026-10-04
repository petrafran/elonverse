'use client'

import { useEffect, useRef } from 'react'
import { topicLabels, type Topic } from '@/lib/catalog'
import { TopicIcon } from './topic-icon'
import { useElonverse } from './elonverse-provider'

const topics = Object.keys(topicLabels) as Topic[]

export function TopicNav() {
  const { topic, setTopic, scrollToMarkets } = useElonverse()
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rail = railRef.current
    const active = rail?.querySelector<HTMLButtonElement>(`[data-topic="${topic}"]`)
    if (!rail || !active) return
    const a = active.getBoundingClientRect()
    const r = rail.getBoundingClientRect()
    if (a.left < r.left || a.right > r.right) active.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' })
  }, [topic])

  return (
    <nav className="topic-navigation" aria-label="Browse Elonverse topics">
      <div className="topic-rail" role="group" aria-label="Topic filters" ref={railRef}>
        {topics.map((value) => (
          <button
            key={value}
            type="button"
            data-topic={value}
            className={topic === value ? 'active' : undefined}
            aria-pressed={topic === value}
            onClick={() => {
              setTopic(value)
              scrollToMarkets()
            }}
          >
            <span aria-hidden="true">
              <TopicIcon topic={value} size={17} />
            </span>
            {topicLabels[value]}
          </button>
        ))}
      </div>
    </nav>
  )
}
