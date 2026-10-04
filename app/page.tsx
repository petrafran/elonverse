import { catalog } from '@/lib/catalog'
import { fetchOdds } from '@/lib/polymarket'
import { fetchPerps } from '@/lib/perps'
import { ElonverseProvider } from '@/components/elonverse-provider'
import { SiteHeader } from '@/components/site-header'
import { TopicNav } from '@/components/topic-nav'
import { Masthead } from '@/components/masthead'
import { MarketsSection } from '@/components/markets-section'
import { PerpsSection } from '@/components/perps-section'
import { MarketDialog } from '@/components/market-dialog'
import { BetAgainstSection, CultureSection, LedgerSection, SiteFooter } from '@/components/static-sections'

export const revalidate = 60

export default async function Page() {
  const [odds, perps] = await Promise.all([
    fetchOdds().catch(() => ({ odds: {}, fetchedAt: new Date().toISOString() })),
    fetchPerps().catch(() => ({ perps: {}, count: 0, fetchedAt: new Date().toISOString() })),
  ])

  return (
    <ElonverseProvider markets={catalog.markets} initialOdds={odds}>
      <a className="skip-link" href="#content">
        Skip to markets
      </a>
      <SiteHeader />
      <TopicNav />
      <main id="content">
        <Masthead />
        <MarketsSection />
        <PerpsSection initial={perps} />
        <BetAgainstSection />
        <LedgerSection />
        <CultureSection />
      </main>
      <SiteFooter />
      <MarketDialog />
    </ElonverseProvider>
  )
}
