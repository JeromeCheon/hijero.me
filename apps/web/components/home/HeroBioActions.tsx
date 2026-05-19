'use client'

import Image from 'next/image'
import { Coffee, MoreHorizontal } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { Link } from '@/i18n/navigation'

interface HeroBioActionsProps {
  buyMeACoffeeUrl: string
  calChatUrl: string
  coffeeChatLabel: string
  viewDetailLabel: string
}

export function HeroBioActions({
  buyMeACoffeeUrl,
  calChatUrl,
  coffeeChatLabel,
  viewDetailLabel,
}: HeroBioActionsProps) {
  return (
    <div className="mt-4 flex flex-nowrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="더보기"
            className="h-8 w-8 shrink-0 sm:h-10 sm:w-10"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild>
            <Link href="/resume">{viewDetailLabel}</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <a
        href={buyMeACoffeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0"
      >
        <Image
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me a Coffee"
          width={140}
          height={40}
          className="h-8 w-auto sm:h-10"
        />
      </a>

      <Button asChild size="sm" className="h-8 shrink-0 px-2 sm:h-10 sm:px-3">
        <a href={calChatUrl} target="_blank" rel="noopener noreferrer">
          <Coffee className="mr-1 size-3.5 sm:mr-1.5 sm:size-4" />
          <span className="text-xs sm:text-sm">{coffeeChatLabel}</span>
        </a>
      </Button>
    </div>
  )
}
