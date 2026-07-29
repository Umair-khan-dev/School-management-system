import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { School, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@school.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await login(email, password)
    if (res.success) {
      toast.success('Welcome back!')
      navigate('/')
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-gradient p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-black/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <School size={20} />
          </div>
          <span className="font-display text-xl font-bold">EduAdmin</span>
        </div>

        <div className="relative">
          <h1 className="font-display text-4xl font-bold leading-tight">
            One dashboard for your entire campus.
          </h1>
          <p className="mt-4 max-w-md text-brand-100">
            Manage student records, teaching staff, and fee collection in one clean,
            fast, and reliable system built for real school operations.
          </p>
          <div className="mt-8 flex gap-8">
            <div>
              <p className="font-display text-2xl font-bold">100%</p>
              <p className="text-sm text-brand-100">Cloud based</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold">24/7</p>
              <p className="text-sm text-brand-100">Access anywhere</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold">Secure</p>
              <p className="text-sm text-brand-100">Role based login</p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-brand-100/70">
          © {new Date().getFullYear()} Edu Admin School Management System
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
              <School size={18} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold text-ink-900">EduAdmin</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-ink-900">Welcome back</h2>
          <p className="mt-1.5 text-sm text-slate-500">Sign in to access your school dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full !py-3">
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-brand-50 p-3.5 text-xs text-slate-500">
            <span className="font-semibold text-brand-700">Demo credentials — </span>
            email <span className="font-mono">admin@school.com</span>, password{' '}
            <span className="font-mono">Admin@123</span>
          </div>
        </div>
      </div>
    </div>
  )
}
