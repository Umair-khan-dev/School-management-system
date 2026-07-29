const pool = require('../config/db');

// GET /api/teachers?search=&subject=&status=&page=&limit=
exports.getTeachers = async (req, res, next) => {
  try {
    const { search = '', subject = '', status = '', page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let where = 'WHERE 1=1';
    const params = [];

    if (search) {
      where += ' AND (name LIKE ? OR employee_id LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (subject) {
      where += ' AND subject = ?';
      params.push(subject);
    }
    if (status) {
      where += ' AND status = ?';
      params.push(status);
    }

    const [rows] = await pool.query(
      `SELECT * FROM teachers ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );
    const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM teachers ${where}`, params);

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

// GET /api/teachers/:id
exports.getTeacherById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/teachers
exports.createTeacher = async (req, res, next) => {
  try {
    const {
      employee_id, name, subject, qualification, gender,
      email, phone, address, joining_date, salary, status
    } = req.body;

    if (!employee_id || !name || !subject) {
      return res.status(400).json({ success: false, message: 'Employee ID, name and subject are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO teachers
        (employee_id, name, subject, qualification, gender, email, phone, address, joining_date, salary, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employee_id, name, subject, qualification || null, gender || null, email || null, phone || null,
        address || null, joining_date || new Date().toISOString().slice(0, 10), salary || 0, status || 'Active']
    );

    const [newRow] = await pool.query('SELECT * FROM teachers WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Teacher added successfully.', data: newRow[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/teachers/:id
exports.updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM teachers WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }

    const current = existing[0];
    const {
      employee_id, name, subject, qualification, gender,
      email, phone, address, joining_date, salary, status
    } = req.body;

    await pool.query(
      `UPDATE teachers SET
        employee_id = ?, name = ?, subject = ?, qualification = ?, gender = ?,
        email = ?, phone = ?, address = ?, joining_date = ?, salary = ?, status = ?
       WHERE id = ?`,
      [
        employee_id ?? current.employee_id, name ?? current.name, subject ?? current.subject,
        qualification ?? current.qualification, gender ?? current.gender, email ?? current.email,
        phone ?? current.phone, address ?? current.address, joining_date ?? current.joining_date,
        salary ?? current.salary, status ?? current.status, id
      ]
    );

    const [updated] = await pool.query('SELECT * FROM teachers WHERE id = ?', [id]);
    res.json({ success: true, message: 'Teacher updated successfully.', data: updated[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/teachers/:id
exports.deleteTeacher = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM teachers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }
    res.json({ success: true, message: 'Teacher deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
