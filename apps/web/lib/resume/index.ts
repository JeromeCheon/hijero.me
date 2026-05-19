import type { ResumeData } from './types'
import { koResumeData } from './data.ko'
import { enResumeData } from './data.en'

export function getResumeData(locale: string): ResumeData {
  return locale === 'ko' ? koResumeData : enResumeData
}
