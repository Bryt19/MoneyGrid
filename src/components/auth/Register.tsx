import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { AuthCard } from '../ui/AuthCard'

const PASSWORD_MIN = 8
const PASSWORD_REGEX = {
  upper: /[A-Z]/,
  number: /\d/,
  symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
}

function isStrongPassword(p: string): boolean {
  return (
    p.length >= PASSWORD_MIN &&
    PASSWORD_REGEX.upper.test(p) &&
    PASSWORD_REGEX.number.test(p) &&
    PASSWORD_REGEX.symbol.test(p)
  )
}

function passwordErrors(p: string): string[] {
  const errs: string[] = []
  if (p.length > 0 && p.length < PASSWORD_MIN) errs.push(`At least ${PASSWORD_MIN} characters`)
  if (p.length > 0 && !PASSWORD_REGEX.upper.test(p)) errs.push('One capital letter')
  if (p.length > 0 && !PASSWORD_REGEX.number.test(p)) errs.push('One number')
  if (p.length > 0 && !PASSWORD_REGEX.symbol.test(p)) errs.push('One symbol')
  return errs
}

export const Register = () => {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isStrongPassword(password)) {
      setError(
        'Password must be at least 8 characters with one capital letter, one number, and one symbol.'
      )
      return
    }
    setLoading(true)
    try {
      await signUp(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed.')
    } finally {
      setLoading(false)
    }
  }

  const pwdErrs = passwordErrors(password)

  return (
    <AuthCard
      mode="signup"
      title="Create your account"
      subtitle="Get started with MoneyGrid in seconds"
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      showPassword={showPassword}
      onShowPasswordToggle={() => setShowPassword((p) => !p)}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      submitLabel={loading ? 'Creating account…' : 'Create account'}
      emailId="register-email"
      passwordId="register-password"
      emailAutoComplete="email"
      passwordAutoComplete="new-password"
      passwordMinLength={PASSWORD_MIN}
      passwordHint="At least 8 characters, 1 capital letter, 1 number, 1 symbol."
      passwordErrors={pwdErrs}
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary hover:underline focus:outline-none focus:underline"
          >
            Sign in
          </Link>
        </>
      }
    />
  )
}
