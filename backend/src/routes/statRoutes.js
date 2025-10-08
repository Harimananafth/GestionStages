const express = require('express');
const router = express.Router();
const StatistiqueController = require('../controllers/statController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/', authMiddleware, StatistiqueController.getAllStats);

module.exports = { prefix: '/stats', router };
