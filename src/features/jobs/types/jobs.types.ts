import type { SkillResponse } from '@/types/api.types'
import type { WorkMode, JobType, JobStatus } from '@/types/global.types'

//  Responses 

export interface JobOfferSummaryResponse {
  id:          number
  companyName: string | null
  title:       string
  workMode:    WorkMode | null
  jobType:     JobType  | null
  status:      JobStatus
  location:    string | null
  createdAt:   string
  skills:      SkillResponse[]
}

export interface JobOfferResponse {
  id:                   number
  companyId:            number
  companyName:          string | null
  title:                string
  description:          string | null
  responsibilities:     string | null
  requirements:         string | null
  benefits:             string | null
  workMode:             WorkMode  | null
  jobType:              JobType   | null
  status:               JobStatus
  location:             string | null
  requiresInterview:    boolean
  createdAt:            string
  expiresAt:            string | null
  skills:               SkillResponse[]
}

//  Requests 

export interface CreateJobOfferRequest {
  title:                 string
  description?:          string
  responsibilities?:     string
  requirements?:         string
  benefits?:             string
  workMode?:             WorkMode
  jobType?:              JobType
  location?:             string
  interviewInstructions?: string
  requiresInterview?:    boolean
  expiresAt?:            string
  skillIds?:             number[]
}

export interface UpdateJobOfferStatusRequest {
  status: JobStatus
}

//  Query params 

export interface ListJobOffersParams {
  workMode?: WorkMode
  jobType?:  JobType
  skillId?:  number
  keyword?:  string
  page?:     number
  size?:     number
}

//  Interview instructions (company-only) 

export interface JobOfferInterviewInstructionsResponse {
  jobOfferId:            number
  jobOfferTitle:         string
  interviewInstructions: string | null
  requiresInterview:     boolean
}