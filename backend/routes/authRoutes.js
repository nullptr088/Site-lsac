// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/authController');

// Ruta pentru înregistrare
router.post('/register', registerUser);

// Ruta pentru autentificare
router.post('/login', authUser);

module.exports = router;