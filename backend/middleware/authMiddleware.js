// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

// Middleware pentru protejarea rutelor (verifică token-ul JWT)
const protect = async (req, res, next) => {
    let token;

    // 1. Verifică dacă token-ul este prezent în header
    // Formatul așteptat: Authorization: Bearer <TOKEN>
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extrage token-ul din header (Bearer [token])
            token = req.headers.authorization.split(' ')[1];

            // 2. Verifică și decodează token-ul
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // 3. Găsește utilizatorul și îl atașează la obiectul request (fără parola)
            req.user = await UserModel.findById(decoded.id).select('-password');
            
            if (!req.user) {
                 // Token valid, dar userul nu mai există în DB
                 return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Continuă la funcția controller-ului
            next(); 

        } catch (error) {
            console.error(error);
            // Dacă token-ul e invalid sau expirat
            res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };