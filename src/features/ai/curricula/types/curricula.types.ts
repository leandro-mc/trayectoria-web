//  Content shape returned by the AI 

export interface CurriculumExperience {
  company:     string
  position:    string
  description: string
  period:      string
}

export interface CurriculumEducation {
  institution: string
  degree:      string
  period:      string
}

export interface CurriculumLanguage {
  language: string
  level:    string
}

export interface CurriculumContent {
  summary:    string
  experience: CurriculumExperience[]
  education:  CurriculumEducation[]
  skills:     string[]
  languages:  CurriculumLanguage[]
  highlights?: string[]   // Puntos clave para esta oferta específica
}

//  API responses 

export interface GeneratedCurriculumResponse {
  id:            number
  jobOfferId:    number | null
  jobOfferTitle: string | null
  content:       CurriculumContent
  isAiGenerated: boolean
  createdAt:     string
}

//  Requests 

export interface GenerateCurriculumRequest {
  jobOfferId: number
}
