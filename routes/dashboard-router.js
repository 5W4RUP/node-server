const express = require('express');
const dashboardController = require('../controllers/DashboardController');
const router = express.Router();
const authenticateUser = require('../middlewares/auth')


router.get('/dashboard', authenticateUser, dashboardController.getNotes);
router.get('/dashboard/note/:id', authenticateUser, dashboardController.getNotesById);

module.exports = router;