import { catalog } from '@/lib/catalog'
import { ElonverseProvider } from '@/components/elonverse-provider'
import { SiteHeader } from '@/components/site-header'
import { TopicNav } from '@/components/topic-nav'
import { Masthead } from '@/components/masthead'
import { MarketsSection } from '@/components/markets-section'
import { PerpsSection } from '@/components/perps-section'
import { MarketDialog } from '@/components/market-dialog'
import { BetAgainstSection, CultureSection, LedgerSection, SiteFooter } from '@/components/static-sections'

export default function Page() {
  return (
    <ElonverseProvider markets={catalog.markets}>
      <a className="skip-link" href="#content">
        Skip to markets
      </a>
      <SiteHeader />
      <TopicNav />
      <main id="content">
        <Masthead />
        <MarketsSection snapshotLabel={catalog.snapshotLabel} />
        <PerpsSection snapshot={catalog.perps} snapshotTime={catalog.perpCheckedAt} />
        <BetAgainstSection />
        <LedgerSection />
        <CultureSection />
      </main>
      <SiteFooter />
      <MarketDialog />
    </ElonverseProvider>
  )
}
