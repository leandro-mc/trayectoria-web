import type { Metadata } from 'next'
import { RegisterRoleSelector } from '@/features/auth/components/RegisterRoleSelector'

export const metadata: Metadata = {
  title: 'Crear cuenta',
}

export default function RegisterPage() {
  return <RegisterRoleSelector />
}
