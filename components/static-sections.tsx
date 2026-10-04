import { CultureButton } from './culture-button'

const ledger = [
  {
    tag: 'SPACEX / MARS',
    title: 'Make life multiplanetary.',
    body: 'SpaceX’s Mars roadmap connects Starship development to human exploration. Launch, arrival and landing deserve separate markets.',
    next: 'A Starship launch toward Mars',
    href: 'https://new.spacex.com/content/starship-talks/mars-2026',
    link: 'SpaceX roadmap · May 2025',
  },
  {
    tag: 'TESLA / AUTONOMY',
    title: 'A city without a driver.',
    body: 'Tesla’s Robotaxi support page lists six cities. The useful question now is expansion, with explicit rules for in-car supervision.',
    next: 'Robotaxi coverage in 10 U.S. cities',
    href: 'https://www.tesla.com/support/robotaxi',
    link: 'Tesla service areas · checked Oct 2',
  },
  {
    tag: 'HYPERLOOP / OPEN IDEA',
    title: 'The idea can outlive the inventor.',
    body: 'Follow the technology, whoever builds it. A passenger service market should count any qualifying operator and exclude a test ride.',
    next: 'Paid public passenger service',
    href: 'https://www.tesla.com/sites/default/files/blog_images/hyperloop-alpha.pdf',
    link: 'Hyperloop Alpha · original proposal',
  },
]

export function BetAgainstSection() {
  return (
    <section id="bet-against" className="bet-against-section" aria-labelledby="bet-against-title">
      <div className="bet-against-copy">
        <span className="eyebrow">THE OTHER SIDE OF THE ORBIT</span>
        <h2 id="bet-against-title">
          Willing to bet <br />
          <i>against Elon?</i>
        </h2>
        <p>Short EVERSE. Take the other side of the Elonverse.</p>
        <span className="coming-soon-badge">Coming soon</span>
      </div>
      <div className="everse-short-card">
        <div className="everse-short-top">
          <span className="tag">EVERSE / SHORT</span>
          <span className="short-arrow" aria-hidden="true">
            ↘
          </span>
        </div>
        <h3>Short the orbit.</h3>
        <p>EVERSE shorting is not available yet.</p>
        <button type="button" className="everse-short-button" disabled>
          Short EVERSE <span aria-hidden="true">↘</span>
        </button>
      </div>
    </section>
  )
}

export function LedgerSection() {
  return (
    <section id="ledger" className="ledger-section" aria-labelledby="ledger-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">03 / THE PROMISE LEDGER</span>
          <h2 id="ledger-title">
            {'From “soon” to '}
            <i>show me.</i>
          </h2>
        </div>
        <p>
          The ambition, the evidence,
          <br />
          and the next thing to watch.
        </p>
      </div>
      <div className="ledger-grid">
        {ledger.map((item, index) => (
          <article className="ledger-card" key={item.tag}>
            <span className="ledger-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="tag">{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <div className="ledger-next">
              <small>NEXT MILESTONE TO PRICE</small>
              <strong>{item.next}</strong>
            </div>
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              {item.link}
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

export function CultureSection() {
  return (
    <section id="culture" className="culture-section" aria-labelledby="culture-title">
      <div>
        <span className="eyebrow">04 / SIDE QUESTS</span>
        <h2 id="culture-title">
          Even Mars needs
          <br />a little drama.
        </h2>
        <p>
          Event appearances, surprise cameos, posting sprees.
          <br />
          The human side of the Elonverse.
        </p>
        <CultureButton />
      </div>
      <div className="culture-ideas">
        <span className="tag">CULTURE MARKET IDEAS</span>
        <p>
          At the Met Gala?<span>2027</span>
        </p>
        <p>
          A Super Bowl appearance?<span>2027</span>
        </p>
        <p>
          A new film cameo?<span>2027</span>
        </p>
        <small>{'Attendance and cameos need public evidence. An invitation or rumor doesn’t count.'}</small>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer>
      <a className="brand" href="#">
        elonverse<span className="brand-dot">.</span>
      </a>
      <p>
        An independent orbit of predictions.
        <br />
        Not affiliated with Elon Musk or his companies.
      </p>
      <span>EARTH, FOR NOW. © 2026</span>
    </footer>
  )
}
