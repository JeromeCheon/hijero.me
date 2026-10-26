// SEO 감사 하네스: 실행 중인 서버(로컬 pnpm start 또는 prod)에 요청을 보내 색인 신호를 검사한다.
// 사용: pnpm check:seo [baseUrl]  (기본 http://localhost:3000)
import { mkdirSync, writeFileSync } from 'node:fs'

const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')
const REPORT = new URL(
  '../../../.claude/_workspace/seo-report.md',
  import.meta.url
)

interface Page {
  status: number
  location: string | null
  canonical: string | null
  hreflangs: string[]
  noindex: boolean
  hasLinkHeader: boolean
  ogImage: boolean
}

interface Check {
  name: string
  ok: boolean
  detail: string
}

const attr = (tag: string, name: string) =>
  tag.match(new RegExp(`${name}="([^"]*)"`, 'i'))?.[1] ?? null

async function probe(url: string): Promise<Page> {
  const res = await fetch(url, { redirect: 'manual' })
  const html = res.status === 200 ? await res.text() : ''
  const links = html.match(/<link\b[^>]*>/g) ?? []
  const robots = html.match(
    /<meta[^>]*name="robots"[^>]*content="([^"]*)"/
  )?.[1]
  return {
    status: res.status,
    location: res.headers.get('location'),
    canonical:
      links
        .filter((l) => attr(l, 'rel') === 'canonical')
        .map((l) => attr(l, 'href'))[0] ?? null,
    hreflangs: links
      .filter((l) => attr(l, 'hreflang'))
      .map((l) => attr(l, 'href') ?? ''),
    noindex: /noindex/.test(robots ?? ''),
    hasLinkHeader: /hreflang/.test(res.headers.get('link') ?? ''),
    ogImage: /property="og:image"/.test(html),
  }
}

// `/ko/tech/x` -> `/tech/x` : locale 접두사를 뗀 경로
const withoutLocale = (url: string) =>
  new URL(url).pathname.replace(/^\/(ko|en)(?=\/|$)/, '') || '/'

function queryVariantOk(page: Page, cleanUrl: string): boolean {
  return page.canonical === cleanUrl
}

const checks: Check[] = []
const add = (name: string, ok: boolean, detail = '') =>
  checks.push({ name, ok, detail })

async function main() {
  // 1) 사이트맵의 모든 URL: 200 + self-canonical + hreflang 정합
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!)
  add('sitemap 비어있지 않음', urls.length > 0, `${urls.length} URLs`)
  add(
    '[sitemap] URL 중복 없음',
    new Set(urls).size === urls.length,
    `${urls.length - new Set(urls).size}개 중복`
  )
  // 색인 가능한 페이지가 사이트맵에서 빠지지 않았는지 (정적 프로젝트는 hijero-me 기준)
  const origin = new URL(urls[0]!).origin
  for (const p of [
    '/ko/projects',
    '/en/projects',
    '/ko/projects/hijero-me',
    '/en/projects/hijero-me',
  ]) {
    add(`[sitemap] 필수 URL: ${p}`, urls.includes(`${origin}${p}`))
  }

  for (const url of urls) {
    // 사이트맵은 SITE_URL(prod) 기준이라 요청은 base로 치환해서 보낸다
    const page = await probe(`${base}${new URL(url).pathname}`)
    add(`[sitemap] 200: ${url}`, page.status === 200, `status ${page.status}`)
    if (page.status !== 200) continue
    add(
      `[sitemap] self-canonical: ${url}`,
      page.canonical === url,
      page.canonical ?? 'canonical 없음'
    )
    // 빈 배열은 아래 경로 검사를 무의미하게 통과하므로 존재 자체를 먼저 요구한다
    add(
      `[sitemap] hreflang 존재: ${url}`,
      page.hreflangs.length >= 2,
      `${page.hreflangs.length}개`
    )
    const rest = withoutLocale(url)
    const bad = page.hreflangs.filter((h) => withoutLocale(h) !== rest)
    add(
      `[sitemap] hreflang 경로 일치: ${url}`,
      bad.length === 0,
      bad.join(', ')
    )
    add(
      `[sitemap] Link 헤더/head hreflang 중복 없음: ${url}`,
      !(page.hasLinkHeader && page.hreflangs.length > 0)
    )
  }

  // 2) 접두사 없음/trailing slash는 정규 URL로 리다이렉트되어야 한다
  const redirects: [string, string][] = [
    ['/', '/ko'],
    ['/tech', '/ko/tech'],
    ['/ko/tech/', '/ko/tech'],
  ]
  for (const [from, to] of redirects) {
    const page = await probe(`${base}${from}`)
    const dest = page.location ? new URL(page.location, base).pathname : null
    add(
      `[redirect] ${from} -> ${to}`,
      page.status >= 300 && page.status < 400 && dest === to,
      `status ${page.status}, → ${dest}`
    )
  }

  // 3) 쿼리 변형
  for (const q of [
    '/ko/tech?sort=popular',
    '/ko/tech?tag=x',
    '/ko/life?sort=popular',
    '/ko?category=tech',
  ]) {
    const page = await probe(`${base}${q}`)
    // canonical은 SITE_URL 기준이므로 사이트맵과 같은 origin으로 비교한다
    const clean = `${new URL(urls[0]!).origin}${q.split('?')[0]}`
    add(
      `[query] ${q}`,
      page.status === 200 && queryVariantOk(page, clean),
      `canonical ${page.canonical}, noindex ${page.noindex}`
    )
  }

  // 4) 없는 페이지는 반드시 404 상태코드 (200이면 soft 404)
  for (const path of [
    '/ko/foo/bar',
    '/ko/tech/no-such-post',
    '/ko/no-such-page',
    '/en/projects/no-such-id',
  ]) {
    const page = await probe(`${base}${path}`)
    add(`[404] ${path}`, page.status === 404, `status ${page.status}`)
  }

  // 5) OG 이미지: 라우트가 프록시에 가로채이지 않고, 홈이 og:image를 선언해야 한다
  // 라우트가 응답 중 연결을 끊으면 fetch가 던지므로 검사기가 죽지 않게 FAIL로 기록한다
  try {
    const og = await fetch(`${base}/opengraph-image`, { redirect: 'manual' })
    const ogType = og.headers.get('content-type') ?? ''
    add(
      '[og] /opengraph-image 200 + image',
      og.status === 200 && ogType.startsWith('image/'),
      `status ${og.status}, ${ogType}`
    )
  } catch (e) {
    add('[og] /opengraph-image 200 + image', false, String(e))
  }
  for (const home of ['/ko', '/en']) {
    const page = await probe(`${base}${home}`)
    add(`[og] og:image 태그: ${home}`, page.ogImage)
  }
}

await main()

const failed = checks.filter((c) => !c.ok)
const lines = [
  `# SEO 감사 리포트`,
  ``,
  `- 대상: ${base}`,
  `- 결과: ${checks.length - failed.length}/${checks.length} PASS`,
  ``,
  `| | 검사 | 상세 |`,
  `|---|---|---|`,
  ...checks.map(
    (c) => `| ${c.ok ? 'PASS' : 'FAIL'} | ${c.name} | ${c.detail} |`
  ),
]
mkdirSync(new URL('.', REPORT), { recursive: true })
writeFileSync(REPORT, lines.join('\n') + '\n')
console.log(lines.slice(0, 4).join('\n'))
failed.forEach((c) => console.log(`FAIL ${c.name} — ${c.detail}`))
process.exit(failed.length ? 1 : 0)
