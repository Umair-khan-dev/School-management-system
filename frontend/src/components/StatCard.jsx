export default function StatCard({ icon: Icon, label, value, sublabel, tone = 'brand' }) {
  const tones = {
    brand: 'bg-brand-gradient',
    emerald: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
    amber: 'bg-gradient-to-br from-amber-500 to-amber-700',
    violet: 'bg-gradient-to-br from-violet-500 to-violet-700'
  }

  return (
    <div className="card flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]} text-white shadow-soft`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 truncate font-display text-2xl font-bold text-ink-900">{value}</p>
        {sublabel && <p className="mt-0.5 text-xs text-slate-400">{sublabel}</p>}
      </div>
    </div>
  )
}
