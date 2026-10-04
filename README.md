# Elonverse

A static prediction-market hub for Elon Musk's missions, machines, ideas, and cultural orbit.

The site includes:

- A layered header with mouse and scroll parallax, respecting reduced-motion preferences.
- A sticky horizontal topic bar: Home, Neuralink, SpaceX, Grok Bot, Mentions, Tesla, Hyperloop, Post counts, X activity, Culture, and Big ideas.
- Market snapshots linking to Polymarket and Kalshi, alongside clearly labeled market proposals.
- X activity proposals for post counts, keywords, products, account mentions, and hashtags.
- Tesla, SpaceX, and DOGE perpetual contract cards with public Hyperliquid price refreshes.
- A promise ledger and culture section.
- A Buy EVERSE button awaiting its external destination URL, and a Coming soon section for shorting EVERSE.

## Run locally

No dependencies or build step are required. From the repository root:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173 in a browser.

`Elonverse.html` is the same site packaged as a standalone file with the artwork and catalog embedded. Download it and open it in a browser. Google Fonts and live PERP price refreshes use network access.

## Files

- `dist/index.html`: layout and page content.
- `dist/styles.css`: styles and responsive layout.
- `dist/app.js`: filters, market details, parallax, public PERP refreshes, and optional WebMCP tools.
- `dist/catalog.json`: saved market and PERP snapshots, proposal rules, and provenance.
- `dist/*.png`: original and layered header artwork.
- `docs/`: artwork generation prompts and tool provenance.
- `tools/export-site.py`: regenerate the standalone HTML from `dist/`.

## Data and trading

Prediction-market odds are saved snapshots checked on October 2, 2026, not a live feed. Market availability and probabilities may have changed. Cards and detail dialogs distinguish venue listings from proposed markets, which have not been created or funded. Neuralink currently has no entries in this catalog.

PERP cards refresh through the public Hyperliquid endpoint when the site loads or Refresh prices is pressed. If refreshing fails, the saved figures remain visible with their timestamps.

Trading takes place on external venues. The site does not connect wallets or place trades. EVERSE shorting is a disabled Coming soon placeholder. To activate Buy EVERSE, supply the intended venue URL, add it to the header anchor in `dist/index.html`, set `target="_blank"` and `rel="noopener noreferrer"`, and remove the pending class and disabled attributes. Then regenerate the standalone file.

## Update the standalone file

```sh
python3 tools/export-site.py
```

This regenerates `Elonverse.html` without changing the market snapshot dates or contacting any trading service.

Elonverse is independent and is not affiliated with Elon Musk or his companies.
