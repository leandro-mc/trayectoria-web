// src/features/skills/hooks/useSkillsCatalog.ts

import { useQuery } from '@tanstack/react-query'
import { skillsApi } from '../api/skills.api'
import { QUERY_KEYS } from '@/config/query-keys'

export function useSkillsCatalog(search = '') {
  return useQuery({
    queryKey: search
      ? QUERY_KEYS.skills.catalogFiltered(search)
      : QUERY_KEYS.skills.catalog,
    queryFn:  () => skillsApi.getCatalog(search || undefined),
    staleTime: 1000 * 60 * 10, // catalog rarely changes
    enabled:  search.length === 0 || search.length >= 2,
  })
}
