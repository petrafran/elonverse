'use client'

import { useElonverse } from './elonverse-provider'

export function SiteHeader() {
  const { setTopic } = useElonverse()
  return (
    <header className="site-header">
      <a className="brand" href="#" aria-label="Elonverse home" onClick={() => setTopic('home')}>
        <span className="brand-mark" aria-hidden="true">
          e
        </span>
        elonverse<span className="brand-dot">.</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="#markets" className="nav-active">
          Markets
        </a>
        <a href="#markets" onClick={() => setTopic('x')}>
          X activity
        </a>
        <a href="#perps">PERPs</a>
        <a href="#bet-against">Short EVERSE</a>
        <a href="#ledger">Promise ledger</a>
        <a href="#culture">Culture</a>
      </nav>
      <a className="everse-buy is-pending" role="link" aria-disabled="true" title="Purchase link not available yet">
        Buy EVERSE <span aria-hidden="true">↗</span>
      </a>
    </header>
  )
}
