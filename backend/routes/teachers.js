const express = require('express');
const router = express.Router();
const {
  getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher
} = require('../controllers/teacherController');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', createTeacher);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

module.exports = router;
