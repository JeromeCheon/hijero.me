import type { MDXComponents } from 'mdx/types'
import type {
  AnchorHTMLAttributes,
  BlockquoteHTMLAttributes,
  HTMLAttributes,
  OlHTMLAttributes,
} from 'react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="mt-8 mb-4 text-4xl font-bold tracking-tight" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className="mt-8 mb-3 text-3xl font-semibold tracking-tight"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="mt-6 mb-3 text-2xl font-semibold" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h4 className="mt-6 mb-2 text-xl font-semibold" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h5 className="mt-4 mb-2 text-lg font-semibold" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h6 className="mt-4 mb-2 text-base font-semibold" {...props}>
        {children}
      </h6>
    ),
    p: ({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
      <p className="mb-4 leading-7" {...props}>
        {children}
      </p>
    ),
    code: ({ children, ...props }: HTMLAttributes<HTMLElement>) => (
      <code
        className="rounded bg-muted px-1 py-0.5 font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }: HTMLAttributes<HTMLPreElement>) => (
      <pre className="my-4 overflow-x-auto rounded-lg p-4" {...props}>
        {children}
      </pre>
    ),
    blockquote: ({
      children,
      ...props
    }: BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className="my-4 border-l-4 border-muted-foreground/30 pl-4 text-muted-foreground italic"
        {...props}
      >
        {children}
      </blockquote>
    ),
    a: ({
      children,
      href,
      ...props
    }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        href={href}
        className="underline decoration-primary underline-offset-4 transition-opacity hover:opacity-70"
        {...props}
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }: HTMLAttributes<HTMLUListElement>) => (
      <ul className="mb-4 ml-6 list-disc space-y-1" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: OlHTMLAttributes<HTMLOListElement>) => (
      <ol className="mb-4 ml-6 list-decimal space-y-1" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: HTMLAttributes<HTMLLIElement>) => (
      <li className="leading-7" {...props}>
        {children}
      </li>
    ),
    ...components,
  }
}
