export interface Education {
  degree: string
  school: string
  major: string
  period: string
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface HighlightItem {
  text: string
  children?: HighlightItem[]
}

export interface WorkExperience {
  company: string
  role: string
  period: string
  highlights: HighlightItem[]
}

export interface Project {
  id: string
  name: string
  company: string
  period: string
  description: string
  tech: string[]
  markdownContent?: string
}

export interface ResumeData {
  education: Education
  skillGroups: SkillGroup[]
  workExperiences: WorkExperience[]
  projects: Project[]
}
