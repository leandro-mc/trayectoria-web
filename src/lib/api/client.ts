import axios, { type AxiosInstance } from 'axios'
import { tokenStorage } from '@/lib/auth/token.storage'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})
