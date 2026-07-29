import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, total, onChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-brand-100 px-1 pt-4 sm:flex-row">
      <p className="text-xs text-slate-500">
        Page <span className="font-semibold text-ink-900">{page}</span> of{' '}
        <span className="font-semibold text-ink-900">{totalPages}</span> · {total} total records
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="btn-secondary !px-3 !py-2 disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="btn-secondary !px-3 !py-2 disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
