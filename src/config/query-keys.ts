export const QUERY_KEYS = {
  //  Auth 
  auth: {
    me: ['auth', 'me'] as const,
  },

  //  Candidate 
  candidate: {
    profile:    ['candidate', 'profile'] as const,
    experience: ['candidate', 'experience'] as const,
    education:  ['candidate', 'education'] as const,
    skills:     ['candidate', 'skills'] as const,
    languages:  ['candidate', 'languages'] as const,
  },

  //  Company 
  company: {
    profile: ['company', 'profile'] as const,
  },

  //  Jobs 
  jobs: {
    all:    ['jobs'] as const,
    list:   (params: Record<string, unknown>) => ['jobs', 'list', params] as const,
    detail: (id: number) => ['jobs', 'detail', id] as const,
    mine:   ['jobs', 'mine'] as const,
  },

  //  Applications 
  applications: {
    mine:     ['applications', 'mine'] as const,
    forOffer: (offerId: number) => ['applications', 'offer', offerId] as const,
  },

  //  Saved Offers 
  savedOffers: {
    all: ['saved-offers'] as const,
    check: (jobOfferId: number) => ['saved-offers', 'check', jobOfferId] as const,
  },

  //  Skills Catalog 
  skills: {
    catalog:          ['skills', 'catalog'] as const,
    catalogFiltered:  (search: string) => ['skills', 'catalog', search] as const,
  },

  //  AI Curricula 
  curricula: {
    all:    ['curricula'] as const,
    detail: (id: number) => ['curricula', 'detail', id] as const,
    latest: (candidateId: number, offerId: number) =>
      ['curricula', 'latest', candidateId, offerId] as const,
    base: (candidateId: number) =>
      ['curricula', 'base', candidateId] as const,
  },

  //  AI Interviews 
  interviews: {
    all:    ['interviews'] as const,
    detail: (id: number) => ['interviews', 'detail', id] as const,
  },
} as const
