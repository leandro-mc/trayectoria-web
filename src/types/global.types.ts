export type UserRole = 'CANDIDATE' | 'COMPANY'

export type WorkMode = 'REMOTE' | 'HYBRID' | 'ON_SITE'
export type JobType  = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP'
export type JobStatus = 'ACTIVE' | 'CLOSED' | 'DRAFT'

export type ApplicationStatus =
  | 'PENDING'
  | 'VIEWED'
  | 'IN_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native'
export type SkillType = 'TECHNICAL' | 'SOFT' | 'TOOL' | 'LANGUAGE'

export type InterviewStatus = 'IN_PROGRESS' | 'COMPLETED'
export type MessageRole = 'USER' | 'ASSISTANT'

export type InterviewRecommendation = 'STRONG_YES' | 'YES' | 'MAYBE' | 'NO'
