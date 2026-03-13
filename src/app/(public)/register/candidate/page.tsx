import type { Metadata } from 'next'
import { RegisterCandidateForm } from '@/features/auth/components/RegisterCandidateForm'

export const metadata: Metadata = {
  title: 'Registrarse como candidato',
}

export default function RegisterCandidatePage() {
  return <RegisterCandidateForm />
}
