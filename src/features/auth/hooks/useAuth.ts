'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '@/stores/auth.store'
import { extractApiError } from '@/lib/utils/format'
import { ROUTES } from '@/config/routes'
import type {
  LoginRequest,
  RegisterCandidateRequest,
  RegisterCompanyRequest,
  AuthResponse,
} from '../types/auth.types'

//  Shared post-auth handler 

function useHandleAuthSuccess() {
  const setAuth   = useAuthStore((s) => s.setAuth)
  const router    = useRouter()
  const searchParams = useSearchParams()

  return (data: AuthResponse) => {
    // setAuth writes tokens to sessionStorage + localStorage + cookie + Zustand state
    setAuth(
      { email: data.email, role: data.role },
      { accessToken: data.accessToken, refreshToken: data.refreshToken },
    )
    // Redirect - respect ?next= param if present, otherwise use role default
    const next = searchParams.get('next')
    const defaultDestination =
      data.role === 'CANDIDATE' ? ROUTES.dashboard : ROUTES.companyDashboard

    // Use replace so the login page is not in browser history
    router.replace(next ?? defaultDestination)
  }
}

//  Login 

export function useLogin() {
  const handleSuccess = useHandleAuthSuccess()

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess:  handleSuccess,
    onError:    (err) => {
      // Error message is extracted in the component via extractApiError
      console.error('[useLogin]', extractApiError(err))
    },
  })
}

//  Register candidate 

export function useRegisterCandidate() {
  const handleSuccess = useHandleAuthSuccess()

  return useMutation<AuthResponse, Error, RegisterCandidateRequest>({
    mutationFn: authApi.registerCandidate,
    onSuccess:  handleSuccess,
  })
}

//  Register company 

export function useRegisterCompany() {
  const handleSuccess = useHandleAuthSuccess()

  return useMutation<AuthResponse, Error, RegisterCompanyRequest>({
    mutationFn: authApi.registerCompany,
    onSuccess:  handleSuccess,
  })
}

//  Logout 

export function useLogout() {
  const logout      = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()
  const router      = useRouter()

  return () => {
    logout()
    queryClient.clear()
    router.push(ROUTES.login)
  }
}
