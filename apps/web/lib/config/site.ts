const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hijero.me'

export const SITE_URL = (
  raw.startsWith('http') ? raw : `https://${raw}`
).replace(/\/$/, '')
