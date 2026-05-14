import createMDX from '@next/mdx'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const withMDX = createMDX({
  options: {
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
}

export default withNextIntl(withMDX(nextConfig))
