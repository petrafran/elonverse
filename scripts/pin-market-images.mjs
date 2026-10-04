import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const jwt = process.env.PINATA_JWT
const force = process.argv.includes('--force')
const localOnly = process.argv.includes('--local-only') || !jwt

const root = path.resolve(import.meta.dirname, '..')
const sourceDir = path.join(root, 'assets/markets')
const publicDir = path.join(root, 'public/markets')
const outFile = path.join(root, 'lib/market-images.json')

const catalog = JSON.parse(await readFile(path.join(root, 'lib/catalog.json'), 'utf8'))
const ids = new Set(catalog.markets.map((m) => m.id))
const existing = JSON.parse(await readFile(outFile, 'utf8').catch(() => '{}'))
const output = {}
await mkdir(publicDir, { recursive: true })

async function pin(id, webp) {
  const form = new FormData()
  form.append('file', new Blob([webp], { type: 'image/webp' }), `elonverse-${id}.webp`)
  form.append('pinataMetadata', JSON.stringify({ name: `elonverse-${id}.webp` }))
  form.append('pinataOptions', JSON.stringify({ cidVersion: 1 }))
  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  })
  if (!response.ok) throw new Error(`Pinata ${response.status} for ${id}: ${await response.text()}`)
  const { IpfsHash } = await response.json()
  return `ipfs://${IpfsHash}`
}

for (const file of (await readdir(sourceDir)).filter((f) => f.endsWith('.png')).sort()) {
  const id = file.replace(/\.png$/, '')
  if (!ids.has(id)) continue
  const webp = await sharp(path.join(sourceDir, file)).resize(1200, 675, { fit: 'cover' }).webp({ quality: 82 }).toBuffer()
  await writeFile(path.join(publicDir, `${id}.webp`), webp)

  if (existing[id] && !force) output[id] = existing[id]
  else if (!localOnly) output[id] = await pin(id, webp)
  console.log(`${id}: ${Math.round(webp.length / 1024)} KB${output[id] ? ` -> ${output[id]}` : ' (local only)'}`)
}

await writeFile(outFile, `${JSON.stringify(output, null, 2)}\n`)
console.log(`Pinned ${Object.keys(output).length}/${ids.size} market images`)
