'use client'

import { useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface Props extends React.HTMLAttributes<HTMLPreElement> {
  'data-language'?: string
}

export default function CodeBlock({
  children,
  'data-language': language,
  className,
  ...props
}: Props) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = async () => {
    const text = preRef.current?.querySelector('code')?.innerText ?? ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const CopyIcon = copied ? (
    <Check className="size-4 text-green-500" />
  ) : (
    <Copy className="size-4 text-muted-foreground" />
  )

  return (
    <div className="code-block-root relative my-6 overflow-hidden rounded-lg border border-border">
      {/* mac 헤더 — standalone 전용, figure 안에서 CSS로 숨김 */}
      <div className="code-block-mac-header flex items-center gap-[0.5625rem] border-b border-border bg-muted/60 px-4 py-2">
        <span className="size-3 rounded-full bg-[#FF5F57]" />
        <span className="size-3 rounded-full bg-[#FEBC2E]" />
        <span className="size-3 rounded-full bg-[#28C840]" />
        {language && (
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          aria-label="코드 복사"
          className="ml-auto rounded p-1.5 transition-colors hover:bg-muted/50"
        >
          {CopyIcon}
        </button>
      </div>
      {/* floating copy 버튼 — figure(titled) 안에서만 CSS display:block으로 표시 */}
      <button
        onClick={handleCopy}
        aria-label="코드 복사"
        className="code-block-copy-float absolute top-3 right-3 z-10 rounded p-1.5 transition-colors hover:bg-muted/50"
      >
        {CopyIcon}
      </button>
      <pre
        ref={preRef}
        className={`overflow-x-auto p-4${className ? ` ${className}` : ''}`}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
