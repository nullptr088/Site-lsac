// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserProfile } = require('../controllers/userController'); // Vom crea asta imediat

// Ruta Protejată: Doar userii logați pot accesa
router.get('/profile', protect, getUserProfile); 

module.exports = router;