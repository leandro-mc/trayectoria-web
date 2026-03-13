import type { Metadata } from 'next'
import { RegisterCompanyForm } from '@/features/auth/components/RegisterCompanyForm'

export const metadata: Metadata = {
  title: 'Registrarse como empresa',
}

export default function RegisterCompanyPage() {
  return <RegisterCompanyForm />
}
