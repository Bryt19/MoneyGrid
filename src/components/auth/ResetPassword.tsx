import type { FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { AuthCard } from '../ui/AuthCard'
import { useNotification } from '../../contexts/NotificationContext'

export const ResetPassword = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useNotification()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        showError('Session expired or invalid. Please request a new reset link.')
        navigate('/login')
      }
    }
    void checkSession()
  }, [navigate, showError])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })
      if (error) throw error
      
      setSuccess('Password updated successfully!')
      showSuccess('Password updated successfully!')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update password.'
      setError(message)
      showError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      mode="reset-password"
      title="Set new password"
      subtitle="Ensure your account is secure with a strong password"
      email=""
      password={password}
      onEmailChange={() => {}}
      onPasswordChange={setPassword}
      confirmPassword={confirmPassword}
      onConfirmPasswordChange={setConfirmPassword}
      showPassword={showPassword}
      onShowPasswordToggle={() => setShowPassword((p) => !p)}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
      submitLabel={loading ? 'Updating…' : 'Update password'}
      footer={null}
      passwordMinLength={8}
    />
  )
}
