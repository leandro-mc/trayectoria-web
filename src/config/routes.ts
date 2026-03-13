
export const ROUTES = {
  //  Public 
  home:              '/' as const,
  login:             '/login' as const,
  register:          '/register' as const,          
  registerCandidate: '/register/candidate' as const,
  registerCompany:   '/register/company' as const,
  publicJobs:        '/jobs' as const,
  publicJob:         (id: number) => `/jobs?id=${id}` as const,

  //  Candidate 
  dashboard:    '/dashboard' as const,
  profile:      '/profile' as const,
  jobs:         '/jobs' as const,
  applications: '/applications' as const,
  saved:        '/saved' as const,
  curricula:    '/ai/curricula' as const,
  interviews:   '/ai/interviews' as const,
  interview:    (id: number) => `/ai/interviews?id=${id}` as const,
  settings:     '/settings' as const,

  //  Company 
  companyDashboard:  '/company/dashboard' as const,
  companyProfile:    '/company/profile' as const,
  offers:            '/company/offers' as const,
  newOffer:          '/company/offers/new' as const,
  offerDetail:       (id: number) => `/company/offers/${id}` as const,
  editOffer:         (id: number) => `/company/offers/${id}/edit` as const,
  offerApplications: (id: number) => `/company/offers/${id}/applications` as const,
} as const
