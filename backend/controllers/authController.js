// controllers/authController.js

const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Funcție utilitară pentru a genera JWT
const generateToken = (id) => {
    // Secretul trebuie să fie stocat în .env!
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Expiră în 30 de zile
    });
};

// @desc    Înregistrarea unui nou utilizator
// @route   POST /api/register
exports.registerUser = async (req, res) => {
    const { full_name, phone, email, password } = req.body;

    try {
        // 1. Verifică dacă utilizatorul există deja
        const userExists = await UserModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // 2. Creează noul utilizator (parola este hashuita automat de hook-ul din model)
        const user = await UserModel.create({
            full_name,
            phone,
            email,
            password,
        });

        // 3. Răspunsul (trimite datele utilizatorului și tokenul)
        if (user) {
            res.status(201).json({
                _id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // Generează token
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        // Mongoose validation or other errors
        console.error("eroare", error);
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
};


// @desc    Autentificarea utilizatorului și obținerea tokenului
// @route   POST /api/login
exports.authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Găsește utilizatorul după email
        const user = await UserModel.findOne({ email });

        // 2. Verifică utilizatorul și parola
        if (user && (await user.matchPassword(password))) {
            // 3. Răspunsul
            res.json({
                _id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // Generează token
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
};