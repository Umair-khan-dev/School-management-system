import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios.js'
import StatusBadge from '../components/StatusBadge.jsx'
import Pagination from '../components/Pagination.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import FeeFormModal from '../components/FeeFormModal.jsx'

const statusFilters = ['All', 'Paid', 'Partial', 'Unpaid']

export default function Fees() {
  const [rows, setRows] = useState([])
  const [students, setStudents] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchFees = useCallback((page = 1, searchTerm = search, status = statusFilter) => {
    setLoading(true)
    api
      .get('/fees', { params: { page, limit: 8, search: searchTerm, status: status === 'All' ? '' : status } })
      .then((res) => {
        setRows(res.data.data)
        setPagination(res.data.pagination)
      })
      .catch(() => toast.error('Failed to load fee records.'))
      .finally(() => setLoading(false))
  }, [search, statusFilter])

  useEffect(() => {
    api.get('/students', { params: { limit: 1000 } }).then((res) => setStudents(res.data.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchFees(1, search, statusFilter), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter])

  const handleSubmit = async (form) => {
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/fees/${editing.id}`, form)
        toast.success('Fee record updated successfully.')
      } else {
        await api.post('/fees', form)
        toast.success('Fee record added successfully.')
      }
      setFormOpen(false)
      setEditing(null)
      fetchFees(pagination.page)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/fees/${deleteTarget.id}`)
      toast.success('Fee record deleted.')
      setDeleteTarget(null)
      fetchFees(rows.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete fee record.')
    } finally {
      setDeleting(false)
    }
  }

  const formatCurrency = (v) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v || 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or roll no..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-1.5 rounded-xl bg-brand-50 p-1">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === s ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-brand-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true) }}
          disabled={students.length === 0}
          className="btn-primary w-full sm:w-auto disabled:opacity-50"
          title={students.length === 0 ? 'Add a student first' : ''}
        >
          <Plus size={17} /> Add Fee Record
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-3 pr-4 font-semibold">Student</th>
                <th className="pb-3 pr-4 font-semibold">Fee Type</th>
                <th className="pb-3 pr-4 font-semibold">Total</th>
                <th className="pb-3 pr-4 font-semibold">Paid</th>
                <th className="pb-3 pr-4 font-semibold">Balance</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {loading ? (
                <tr><td colSpan={7} className="py-10 text-center text-slate-400">Loading fee records…</td></tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <Wallet className="mx-auto mb-2 text-brand-200" size={36} />
                    <p className="text-slate-400">
                      {students.length === 0 ? 'Add a student first, then record their fees.' : 'No fee records found.'}
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((f) => (
                  <tr key={f.id} className="align-middle">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-ink-900">{f.student_name}</p>
                      <p className="text-xs text-slate-400">Roll {f.roll_no} · Class {f.class}{f.section}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{f.fee_type}</td>
                    <td className="py-3 pr-4 text-slate-600">{formatCurrency(f.total_amount)}</td>
                    <td className="py-3 pr-4 text-slate-600">{formatCurrency(f.paid_amount)}</td>
                    <td className="py-3 pr-4 font-medium text-rose-600">
                      {formatCurrency(f.total_amount - f.paid_amount)}
                    </td>
                    <td className="py-3 pr-4"><StatusBadge status={f.status} /></td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setEditing(f); setFormOpen(true) }}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-700"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(f)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onChange={(p) => fetchFees(p)}
          />
        </div>
      </div>

      <FeeFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={handleSubmit}
        initialData={editing}
        students={students}
        loading={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this fee record?"
        message={`This will permanently remove this fee record for ${deleteTarget?.student_name}.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
