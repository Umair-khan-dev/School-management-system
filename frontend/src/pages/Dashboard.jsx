import { useEffect, useState } from 'react'
import { Users, GraduationCap, Wallet, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import api from '../api/axios.js'
import StatCard from '../components/StatCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatCurrency = (v) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0)

  const collectionRate = stats
    ? Math.round((stats.fees.totalCollected / (stats.fees.totalBilled || 1)) * 100)
    : 0

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-slate-400">Loading dashboard…</div>
  }

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-6 text-white sm:p-8">
        <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-brand-100">Fee collection overview</p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
              {formatCurrency(stats?.fees.totalCollected)} collected
            </h2>
            <p className="mt-2 text-sm text-brand-100">
              out of {formatCurrency(stats?.fees.totalBilled)} billed across all students
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
              <svg className="absolute -rotate-90" width="96" height="96">
                <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * collectionRate) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-display text-xl font-bold">{collectionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={stats?.students.total ?? 0} sublabel={`${stats?.students.active ?? 0} active`} tone="brand" />
        <StatCard icon={GraduationCap} label="Total Teachers" value={stats?.teachers.total ?? 0} sublabel={`${stats?.teachers.active ?? 0} active`} tone="violet" />
        <StatCard icon={Wallet} label="Fees Collected" value={formatCurrency(stats?.fees.totalCollected)} tone="emerald" />
        <StatCard icon={AlertCircle} label="Pending Dues" value={formatCurrency(stats?.fees.totalDue)} sublabel={`${stats?.fees.pendingRecords ?? 0} records pending`} tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Class distribution chart */}
        <div className="card lg:col-span-3">
          <h3 className="font-display text-base font-semibold text-ink-900">Students per Class</h3>
          <p className="text-xs text-slate-400">Distribution of enrolled students across classes</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.classDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" vertical={false} />
                <XAxis dataKey="class" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(c) => `Class ${c}`} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: '#fdf2f8' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #fbcfe8', fontSize: 13 }}
                  labelFormatter={(c) => `Class ${c}`}
                />
                <Bar dataKey="count" fill="#db2777" radius={[6, 6, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent students */}
        <div className="card lg:col-span-2">
          <h3 className="font-display text-base font-semibold text-ink-900">Recently Added Students</h3>
          <p className="text-xs text-slate-400">Latest enrollments</p>
          <div className="mt-4 space-y-3">
            {stats?.recentStudents?.length ? (
              stats.recentStudents.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl border border-brand-50 p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                      {s.name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">{s.name}</p>
                      <p className="text-xs text-slate-400">
                        Roll {s.roll_no} · Class {s.class}{s.section}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">No students yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent fee activity */}
      <div className="card">
        <h3 className="font-display text-base font-semibold text-ink-900">Recent Fee Activity</h3>
        <p className="text-xs text-slate-400">Latest fee records created</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-3 pr-4 font-semibold">Student</th>
                <th className="pb-3 pr-4 font-semibold">Total</th>
                <th className="pb-3 pr-4 font-semibold">Paid</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {stats?.recentFees?.length ? (
                stats.recentFees.map((f) => (
                  <tr key={f.id}>
                    <td className="py-3 pr-4 font-medium text-ink-900">{f.student_name}</td>
                    <td className="py-3 pr-4 text-slate-500">{formatCurrency(f.total_amount)}</td>
                    <td className="py-3 pr-4 text-slate-500">{formatCurrency(f.paid_amount)}</td>
                    <td className="py-3">
                      <StatusBadge status={f.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    No fee records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
