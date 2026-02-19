import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { AuthCard } from '../ui/AuthCard'
import { useNotification } from '../../contexts/NotificationContext'

export const ForgotPassword = () => {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotification()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      await resetPassword(email)
      const msg = 'If an account exists for this email, a reset link was sent.'
      setSuccess(msg)
      showSuccess(msg)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to send reset email.'
      setError(message)
      showError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      mode="forgot-password"
      title="Reset your password"
      subtitle="Enter your email to receive a password reset link"
      email={email}
      password=""
      onEmailChange={setEmail}
      onPasswordChange={() => {}}
      showPassword={false}
      onShowPasswordToggle={() => {}}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
      submitLabel={loading ? 'Sending link…' : 'Send reset link'}
      onBackToLogin={() => navigate('/login')}
      footer={null}
    />
  )
}
