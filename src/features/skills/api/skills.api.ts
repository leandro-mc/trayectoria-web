import { apiClient } from '@/lib/api/client'
import type { SkillResponse } from '@/types/api.types'

export const skillsApi = {
  getCatalog: (search?: string) =>
    apiClient
      .get<SkillResponse[]>('/skills', { params: search ? { search } : undefined })
      .then((r) => r.data),
}
