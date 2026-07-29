import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'

const empty = {
  roll_no: '', name: '', class: '', section: '', gender: 'Male', dob: '',
  email: '', phone: '', address: '', parent_name: '', parent_phone: '',
  admission_date: '', status: 'Active'
}

export default function StudentFormModal({ open, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (open) {
      setForm(initialData ? { ...empty, ...initialData, dob: initialData.dob?.slice(0, 10) || '', admission_date: initialData.admission_date?.slice(0, 10) || '' } : empty)
    }
  }, [open, initialData])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Student' : 'Add New Student'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Roll Number *</label>
          <input name="roll_no" required value={form.roll_no} onChange={handleChange} className="input-field" placeholder="S-2026-003" />
        </div>
        <div>
          <label className="label">Full Name *</label>
          <input name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="Full name" />
        </div>
        <div>
          <label className="label">Class *</label>
          <input name="class" required value={form.class} onChange={handleChange} className="input-field" placeholder="e.g. 10" />
        </div>
        <div>
          <label className="label">Section</label>
          <input name="section" value={form.section} onChange={handleChange} className="input-field" placeholder="e.g. A" />
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
          <label className="label">Date of Birth</label>
          <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="student@example.com" />
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
          <label className="label">Parent / Guardian Name</label>
          <input name="parent_name" value={form.parent_name} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label">Parent Phone</label>
          <input name="parent_phone" value={form.parent_phone} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label">Admission Date</label>
          <input type="date" name="admission_date" value={form.admission_date} onChange={handleChange} className="input-field" />
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
            {loading ? 'Saving...' : initialData ? 'Update Student' : 'Add Student'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
