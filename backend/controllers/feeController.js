const pool = require('../config/db');

function computeStatus(total, paid) {
  if (Number(paid) <= 0) return 'Unpaid';
  if (Number(paid) >= Number(total)) return 'Paid';
  return 'Partial';
}

// GET /api/fees?search=&status=&page=&limit=
exports.getFees = async (req, res, next) => {
  try {
    const { search = '', status = '', page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let where = 'WHERE 1=1';
    const params = [];

    if (search) {
      where += ' AND (s.name LIKE ? OR s.roll_no LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
      where += ' AND f.status = ?';
      params.push(status);
    }

    const [rows] = await pool.query(
      `SELECT f.*, s.name AS student_name, s.roll_no, s.class, s.section
       FROM fees f
       JOIN students s ON f.student_id = s.id
       ${where}
       ORDER BY f.created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM fees f JOIN students s ON f.student_id = s.id ${where}`,
      params
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(countRows[0].total / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/fees/student/:studentId
exports.getFeesByStudent = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.*, s.name AS student_name, s.roll_no FROM fees f
       JOIN students s ON f.student_id = s.id WHERE f.student_id = ? ORDER BY f.created_at DESC`,
      [req.params.studentId]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// POST /api/fees
exports.createFee = async (req, res, next) => {
  try {
    const { student_id, fee_type, total_amount, paid_amount, due_date, paid_date, payment_method, remarks } = req.body;

    if (!student_id || !total_amount) {
      return res.status(400).json({ success: false, message: 'Student and total amount are required.' });
    }

    const status = computeStatus(total_amount, paid_amount || 0);

    const [result] = await pool.query(
      `INSERT INTO fees
        (student_id, fee_type, total_amount, paid_amount, due_date, paid_date, payment_method, status, remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [student_id, fee_type || 'Tuition Fee', total_amount, paid_amount || 0, due_date || null,
        paid_date || null, payment_method || 'Cash', status, remarks || null]
    );

    const [newRow] = await pool.query(
      `SELECT f.*, s.name AS student_name, s.roll_no FROM fees f
       JOIN students s ON f.student_id = s.id WHERE f.id = ?`,
      [result.insertId]
    );
    res.status(201).json({ success: true, message: 'Fee record created successfully.', data: newRow[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/fees/:id
exports.updateFee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM fees WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Fee record not found.' });
    }

    const current = existing[0];
    const { fee_type, total_amount, paid_amount, due_date, paid_date, payment_method, remarks } = req.body;

    const newTotal = total_amount ?? current.total_amount;
    const newPaid = paid_amount ?? current.paid_amount;
    const status = computeStatus(newTotal, newPaid);

    await pool.query(
      `UPDATE fees SET
        fee_type = ?, total_amount = ?, paid_amount = ?, due_date = ?, paid_date = ?,
        payment_method = ?, status = ?, remarks = ?
       WHERE id = ?`,
      [
        fee_type ?? current.fee_type, newTotal, newPaid, due_date ?? current.due_date,
        paid_date ?? current.paid_date, payment_method ?? current.payment_method,
        status, remarks ?? current.remarks, id
      ]
    );

    const [updated] = await pool.query(
      `SELECT f.*, s.name AS student_name, s.roll_no FROM fees f
       JOIN students s ON f.student_id = s.id WHERE f.id = ?`,
      [id]
    );
    res.json({ success: true, message: 'Fee record updated successfully.', data: updated[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/fees/:id
exports.deleteFee = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM fees WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Fee record not found.' });
    }
    res.json({ success: true, message: 'Fee record deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
