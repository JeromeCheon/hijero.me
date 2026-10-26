import { SITE_URL } from '@/lib/config/site'

export function pageAlternates(locale: string, path = '') {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      ko: `${SITE_URL}/ko${path}`,
      en: `${SITE_URL}/en${path}`,
      'x-default': `${SITE_URL}/ko${path}`,
    },
  }
}
