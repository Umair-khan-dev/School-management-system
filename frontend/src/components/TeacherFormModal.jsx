import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'

const empty = {
  employee_id: '', name: '', subject: '', qualification: '', gender: 'Male',
  email: '', phone: '', address: '', joining_date: '', salary: '', status: 'Active'
}

export default function TeacherFormModal({ open, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (open) {
      setForm(initialData ? { ...empty, ...initialData, joining_date: initialData.joining_date?.slice(0, 10) || '' } : empty)
    }
  }, [open, initialData])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Teacher' : 'Add New Teacher'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Employee ID *</label>
          <input name="employee_id" required value={form.employee_id} onChange={handleChange} className="input-field" placeholder="T-2026-003" />
        </div>
        <div>
          <label className="label">Full Name *</label>
          <input name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="Full name" />
        </div>
        <div>
          <label className="label">Subject *</label>
          <input name="subject" required value={form.subject} onChange={handleChange} className="input-field" placeholder="e.g. Chemistry" />
        </div>
        <div>
          <label className="label">Qualification</label>
          <input name="qualification" value={form.qualification} onChange={handleChange} className="input-field" placeholder="e.g. M.Sc" />
        </div>
        <div>
          <label className="label">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="label">Joining Date</label>
          <input type="date" name="joining_date" value={form.joining_date} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="teacher@example.com" />
        </div>
        <div>
          <label className="label">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="03001234567" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Address</label>
          <input name="address" value={form.address} onChange={handleChange} className="input-field" placeholder="Street, city" />
        </div>
        <div>
          <label className="label">Monthly Salary</label>
          <input type="number" min="0" step="0.01" name="salary" value={form.salary} onChange={handleChange} className="input-field" placeholder="0.00" />
        </div>
        <div>
          <label className="label">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="input-field">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="sm:col-span-2 mt-2 flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Saving...' : initialData ? 'Update Teacher' : 'Add Teacher'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
