const pool = require('../config/db');

// GET /api/students?search=&class=&status=&page=&limit=
exports.getStudents = async (req, res, next) => {
  try {
    const { search = '', class: className = '', status = '', page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let where = 'WHERE 1=1';
    const params = [];

    if (search) {
      where += ' AND (name LIKE ? OR roll_no LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (className) {
      where += ' AND class = ?';
      params.push(className);
    }
    if (status) {
      where += ' AND status = ?';
      params.push(status);
    }

    const [rows] = await pool.query(
      `SELECT * FROM students ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );
    const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM students ${where}`, params);

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

// GET /api/students/:id
exports.getStudentById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// POST /api/students
exports.createStudent = async (req, res, next) => {
  try {
    const {
      roll_no, name, class: className, section, gender, dob,
      email, phone, address, parent_name, parent_phone, admission_date, status
    } = req.body;

    if (!roll_no || !name || !className) {
      return res.status(400).json({ success: false, message: 'Roll number, name and class are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO students
        (roll_no, name, class, section, gender, dob, email, phone, address, parent_name, parent_phone, admission_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [roll_no, name, className, section || null, gender || null, dob || null, email || null,
        phone || null, address || null, parent_name || null, parent_phone || null,
        admission_date || new Date().toISOString().slice(0, 10), status || 'Active']
    );

    const [newRow] = await pool.query('SELECT * FROM students WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Student added successfully.', data: newRow[0] });
  } catch (err) {
    next(err);
  }
};

// PUT /api/students/:id
exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const current = existing[0];
    const {
      roll_no, name, class: className, section, gender, dob,
      email, phone, address, parent_name, parent_phone, admission_date, status
    } = req.body;

    await pool.query(
      `UPDATE students SET
        roll_no = ?, name = ?, class = ?, section = ?, gender = ?, dob = ?, email = ?,
        phone = ?, address = ?, parent_name = ?, parent_phone = ?, admission_date = ?, status = ?
       WHERE id = ?`,
      [
        roll_no ?? current.roll_no, name ?? current.name, className ?? current.class,
        section ?? current.section, gender ?? current.gender, dob ?? current.dob,
        email ?? current.email, phone ?? current.phone, address ?? current.address,
        parent_name ?? current.parent_name, parent_phone ?? current.parent_phone,
        admission_date ?? current.admission_date, status ?? current.status, id
      ]
    );

    const [updated] = await pool.query('SELECT * FROM students WHERE id = ?', [id]);
    res.json({ success: true, message: 'Student updated successfully.', data: updated[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/students/:id
exports.deleteStudent = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }
    res.json({ success: true, message: 'Student deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
