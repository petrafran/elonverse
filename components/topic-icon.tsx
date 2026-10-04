import type { SVGProps } from 'react'
import { AtSign, Bot, BrainCircuit, Drama, Hash, House, Lightbulb, Rocket, TrainFront, type LucideIcon } from 'lucide-react'
import { matchesTopic, type Market, type MarketCategory, type Topic } from '@/lib/catalog'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function TeslaLogo({ size = 18, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 5.362l2.475-3.026s4.245.09 8.471 2.054c-1.082 1.636-3.231 2.438-3.231 2.438-.146-1.439-1.154-1.79-4.354-1.79L12 24 8.619 5.034c-3.18 0-4.188.354-4.335 1.792 0 0-2.146-.795-3.229-2.43C5.28 2.431 9.525 2.34 9.525 2.34L12 5.362l-.004.002H12v-.002zm0-3.899c3.415-.03 7.326.528 11.328 2.28.535-.968.672-1.395.672-1.395C19.625.612 15.528.015 12 0 8.472.015 4.375.61 0 2.349c0 0 .195.525.672 1.396C4.674 1.989 8.585 1.435 12 1.46v.003z" />
    </svg>
  )
}

function XLogo({ size = 18, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
    </svg>
  )
}

const topicIcons: Record<Topic, LucideIcon | typeof TeslaLogo> = {
  home: House,
  neuralink: BrainCircuit,
  spacex: Rocket,
  grok: Bot,
  mentions: AtSign,
  tesla: TeslaLogo,
  hyperloop: TrainFront,
  posts: Hash,
  x: XLogo,
  culture: Drama,
  ideas: Lightbulb,
}

const categoryFallback: Record<MarketCategory, Topic> = {
  space: 'spacex',
  machines: 'tesla',
  ai: 'grok',
  ideas: 'ideas',
  culture: 'culture',
  x: 'x',
}

const specificTopics: Topic[] = ['neuralink', 'spacex', 'tesla', 'hyperloop', 'grok']

export function TopicIcon({ topic, size = 18 }: { topic: Topic; size?: number }) {
  const Icon = topicIcons[topic]
  return <Icon size={size} aria-hidden="true" />
}

export function marketTopic(market: Market): Topic {
  if (market.category === 'x') return market.xKind === 'volume' ? 'posts' : market.xKind ? 'mentions' : 'x'
  return specificTopics.find((t) => matchesTopic(market, t)) ?? categoryFallback[market.category]
}
