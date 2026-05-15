import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@workspace/ui/components/breadcrumb'

interface PostBreadcrumbProps {
  category: string
}

// 포스트 상세 페이지 상단 카테고리 복귀 breadcrumb
export default function PostBreadcrumb({ category }: PostBreadcrumbProps) {
  const t = useTranslations('Post')

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/${category}`}>{t('backToList', { category })}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
