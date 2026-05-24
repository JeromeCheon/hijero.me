import createMDX from '@next/mdx'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-gfm'],
    rehypePlugins: [
      'rehype-slug',
      [
        'rehype-pretty-code',
        {
          theme: {
            dark: 'github-dark',
            light: 'github-light',
          },
        },
      ],
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  transpilePackages: ['@workspace/ui'],
  images: {
    remotePatterns: [
      { hostname: 'cdn.buymeacoffee.com' },
      { hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      { hostname: 'www.notion.so' },
    ],
  },
}

export default withNextIntl(withMDX(nextConfig))
