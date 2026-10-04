import imageMap from './market-images.json'

export const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'

const pinned = imageMap as Record<string, string>

export function ipfsToHttp(uri: string) {
  return uri.startsWith('ipfs://') ? `${IPFS_GATEWAY}${uri.slice('ipfs://'.length)}` : uri
}

export function marketImage(id: string) {
  const imageUrl = pinned[id]
  return { imageUrl: imageUrl ?? null, src: imageUrl ? ipfsToHttp(imageUrl) : `/markets/${id}.webp` }
}
