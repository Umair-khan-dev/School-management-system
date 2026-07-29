import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'

const empty = {
  student_id: '', fee_type: 'Tuition Fee', total_amount: '', paid_amount: '0',
  due_date: '', paid_date: '', payment_method: 'Cash', remarks: ''
}

export default function FeeFormModal({ open, onClose, onSubmit, initialData, students, loading }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              ...empty,
              ...initialData,
              due_date: initialData.due_date?.slice(0, 10) || '',
              paid_date: initialData.paid_date?.slice(0, 10) || ''
            }
          : empty
      )
    }
  }, [open, initialData])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Fee Record' : 'Add Fee Record'} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Student *</label>
          <select
            name="student_id"
            required
            value={form.student_id}
            onChange={handleChange}
            disabled={!!initialData}
            className="input-field disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">Select a student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — Roll {s.roll_no} (Class {s.class}{s.section})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Fee Type</label>
          <select name="fee_type" value={form.fee_type} onChange={handleChange} className="input-field">
            <option>Tuition Fee</option>
            <option>Admission Fee</option>
            <option>Exam Fee</option>
            <option>Transport Fee</option>
            <option>Library Fee</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="label">Payment Method</label>
          <select name="payment_method" value={form.payment_method} onChange={handleChange} className="input-field">
            <option>Cash</option>
            <option>Card</option>
            <option>Bank Transfer</option>
            <option>Online</option>
            <option>Cheque</option>
          </select>
        </div>

        <div>
          <label className="label">Total Amount *</label>
          <input type="number" min="0" step="0.01" name="total_amount" required value={form.total_amount} onChange={handleChange} className="input-field" placeholder="0.00" />
        </div>
        <div>
          <label className="label">Paid Amount</label>
          <input type="number" min="0" step="0.01" name="paid_amount" value={form.paid_amount} onChange={handleChange} className="input-field" placeholder="0.00" />
        </div>

        <div>
          <label className="label">Due Date</label>
          <input type="date" name="due_date" value={form.due_date} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label">Paid Date</label>
          <input type="date" name="paid_date" value={form.paid_date} onChange={handleChange} className="input-field" />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Remarks</label>
          <input name="remarks" value={form.remarks} onChange={handleChange} className="input-field" placeholder="Optional note" />
        </div>

        <div className="sm:col-span-2 mt-2 flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Saving...' : initialData ? 'Update Record' : 'Add Record'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
