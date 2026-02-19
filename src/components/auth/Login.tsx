import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { AuthCard } from '../ui/AuthCard'
import { useNotification } from '../../contexts/NotificationContext'

export const Login = () => {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { showError } = useNotification()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      await signIn(email, password)
      setSuccess('Login successful')
      setTimeout(() => {
        navigate('/dashboard', { state: { welcome: true } })
      }, 1500)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to sign in. Please try again.'
      setError(message)
      showError('Wrong credentials')
      setLoading(false)
    }
  }

  return (
    <AuthCard
      mode="signin"
      title="Welcome back"
      subtitle="Sign in to your MoneyGrid account"
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      showPassword={showPassword}
      onShowPasswordToggle={() => setShowPassword((p) => !p)}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
      submitLabel={loading ? 'Signing in…' : 'Sign in'}
      emailId="login-email"
      passwordId="login-password"
      emailAutoComplete="email"
      passwordAutoComplete="current-password"
      passwordMinLength={6}
      passwordFooter={
        <Link
          to="/forgot-password"
          className="text-xs font-medium text-primary hover:underline focus:outline-none focus:underline"
        >
          Forgot password?
        </Link>
      }
      footer={
        <div className="flex flex-col gap-2 text-center text-[var(--text-muted)]">
          <div>
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline focus:outline-none focus:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      }
    />
  )
}

