import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Lazy load components
const Layout = lazy(() => import('./components/layout/Layout').then(m => ({ default: m.Layout })))
const Login = lazy(() => import('./components/auth/Login').then(m => ({ default: m.Login })))
const Register = lazy(() => import('./components/auth/Register').then(m => ({ default: m.Register })))
const Dashboard = lazy(() => import('./components/dashboard/Dashboard').then(m => ({ default: m.Dashboard })))
const TransactionList = lazy(() => import('./components/transactions/TransactionList').then(m => ({ default: m.TransactionList })))
const Analytics = lazy(() => import('./components/analytics/Analytics').then(m => ({ default: m.Analytics })))
const Budgets = lazy(() => import('./components/budgets/Budgets').then(m => ({ default: m.Budgets })))
const SavingsGoals = lazy(() => import('./components/savings/SavingsGoals').then(m => ({ default: m.SavingsGoals })))
const Settings = lazy(() => import('./components/settings/Settings').then(m => ({ default: m.Settings })))
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('./components/auth/ResetPassword').then(m => ({ default: m.ResetPassword })))

const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[var(--page-bg)]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent"></div>
  </div>
)

export const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<TransactionList />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="savings-goals" element={<SavingsGoals />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

