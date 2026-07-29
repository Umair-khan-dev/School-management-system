import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios.js'
import StatusBadge from '../components/StatusBadge.jsx'
import Pagination from '../components/Pagination.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import StudentFormModal from '../components/StudentFormModal.jsx'

export default function Students() {
  const [rows, setRows] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchStudents = useCallback((page = 1, searchTerm = search) => {
    setLoading(true)
    api
      .get('/students', { params: { page, limit: 8, search: searchTerm } })
      .then((res) => {
        setRows(res.data.data)
        setPagination(res.data.pagination)
      })
      .catch(() => toast.error('Failed to load students.'))
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => {
    const t = setTimeout(() => fetchStudents(1, search), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleSubmit = async (form) => {
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/students/${editing.id}`, form)
        toast.success('Student updated successfully.')
      } else {
        await api.post('/students', form)
        toast.success('Student added successfully.')
      }
      setFormOpen(false)
      setEditing(null)
      fetchStudents(pagination.page)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/students/${deleteTarget.id}`)
      toast.success('Student deleted.')
      setDeleteTarget(null)
      fetchStudents(rows.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete student.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll number, email..."
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true) }}
          className="btn-primary w-full sm:w-auto"
        >
          <Plus size={17} /> Add Student
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-3 pr-4 font-semibold">Student</th>
                <th className="pb-3 pr-4 font-semibold">Roll No.</th>
                <th className="pb-3 pr-4 font-semibold">Class</th>
                <th className="pb-3 pr-4 font-semibold">Contact</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {loading ? (
                <tr><td colSpan={6} className="py-10 text-center text-slate-400">Loading students…</td></tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <Users className="mx-auto mb-2 text-brand-200" size={36} />
                    <p className="text-slate-400">No students found. Add your first student to get started.</p>
                  </td>
                </tr>
              ) : (
                rows.map((s) => (
                  <tr key={s.id} className="align-middle">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                          {s.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink-900">{s.name}</p>
                          <p className="truncate text-xs text-slate-400">{s.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{s.roll_no}</td>
                    <td className="py-3 pr-4 text-slate-600">Class {s.class}{s.section && ` - ${s.section}`}</td>
                    <td className="py-3 pr-4 text-slate-600">{s.phone || '—'}</td>
                    <td className="py-3 pr-4"><StatusBadge status={s.status} /></td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setEditing(s); setFormOpen(true) }}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-brand-50 hover:text-brand-700"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
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
            onChange={(p) => fetchStudents(p)}
          />
        </div>
      </div>

      <StudentFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={handleSubmit}
        initialData={editing}
        loading={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this student?"
        message={`This will permanently remove ${deleteTarget?.name} and their related fee records.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}
