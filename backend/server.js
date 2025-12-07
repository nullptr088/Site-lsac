// server.js

// 1. Configurare DOTENV (TREBUIE SĂ FIE PRIMA)
require('dotenv').config(); 

// 2. Importuri
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path'); // Modulul Path pentru a rezolva problemele de cale

// 3. Aplicația Express
const app = express();

// 4. Conectarea la Baza de Date
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI) 
    .then(() => {
        console.log("Database connected successfully! (URI din .env)");
    })
    .catch(error => {
        console.error("Database connection error:", error.message);
        process.exit(1); 
    });

// 5. Middleware (ORDINE CRITICĂ: JSON trebuie să fie înainte de rute)
app.use(morgan('dev'));
app.use(cors({ 
    origin: '*', 
    credentials: true 
})); 
// ❗ IMPORTANT: Permite citirea body-ului JSON (req.body) pentru POST/PUT
app.use(express.json()); 


// 6. Rutele
// Ruta de test (pentru diagnostic)
app.get('/test', (req, res) => {
    res.send('Ruta de test functioneaza!');
});

app.get('/', (req, res) => {
    res.send('Welcome to Pimp Your Grill API!');
});

// Conectarea rutelor de autentificare
app.use('/api/auth', require(path.join(__dirname, 'routes', 'authRoutes')));

// Conectarea rutelor de utilizator (Profile)
app.use('/api/user', require(path.join(__dirname, 'routes', 'userRoutes')));

// Conectarea rutelor de grătare (Grills)
app.use('/api/grills', require(path.join(__dirname, 'routes', 'grillRoutes')));


// 7. Pornirea Serverului
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});