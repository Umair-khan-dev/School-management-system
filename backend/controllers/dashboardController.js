const pool = require('../config/db');

// GET /api/dashboard/stats
exports.getStats = async (req, res, next) => {
  try {
    const [[studentCount]] = await pool.query('SELECT COUNT(*) AS total FROM students');
    const [[activeStudentCount]] = await pool.query("SELECT COUNT(*) AS total FROM students WHERE status = 'Active'");
    const [[teacherCount]] = await pool.query('SELECT COUNT(*) AS total FROM teachers');
    const [[activeTeacherCount]] = await pool.query("SELECT COUNT(*) AS total FROM teachers WHERE status = 'Active'");

    const [[feeStats]] = await pool.query(
      `SELECT
        COALESCE(SUM(total_amount), 0) AS totalBilled,
        COALESCE(SUM(paid_amount), 0) AS totalCollected,
        COALESCE(SUM(total_amount - paid_amount), 0) AS totalDue
       FROM fees`
    );

    const [[pendingCount]] = await pool.query("SELECT COUNT(*) AS total FROM fees WHERE status != 'Paid'");

    const [classDistribution] = await pool.query(
      'SELECT class, COUNT(*) AS count FROM students GROUP BY class ORDER BY class'
    );

    const [recentStudents] = await pool.query(
      'SELECT id, name, roll_no, class, section, status, created_at FROM students ORDER BY created_at DESC LIMIT 5'
    );

    const [recentFees] = await pool.query(
      `SELECT f.id, f.total_amount, f.paid_amount, f.status, s.name AS student_name
       FROM fees f JOIN students s ON f.student_id = s.id
       ORDER BY f.created_at DESC LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        students: { total: studentCount.total, active: activeStudentCount.total },
        teachers: { total: teacherCount.total, active: activeTeacherCount.total },
        fees: {
          totalBilled: feeStats.totalBilled,
          totalCollected: feeStats.totalCollected,
          totalDue: feeStats.totalDue,
          pendingRecords: pendingCount.total
        },
        classDistribution,
        recentStudents,
        recentFees
      }
    });
  } catch (err) {
    next(err);
  }
};
