// models/UserModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Pentru criptarea parolei

const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true,
        trim: true,
        lowercase: true 
    },
    password: { // Vom stoca hash-ul aici
        type: String, 
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    username: { 
        type: String,
        trim: true,
        unique: true,
        sparse: true // Permite multiple documente cu null/undefined (dacă nu e obligatoriu)
    },
    full_name: { 
        type: String, 
        trim: true 
    },
    phone: { 
        type: String, 
        trim: true 
    },
    role: { // Pentru Authorization Bonus
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true }); // Adaugă automat createdAt și updatedAt

// --- Pre-save Hook: Criptarea parolei ---
UserSchema.pre('save', async function(next) {
    // Rulează doar dacă parola a fost modificată (sau e nouă)
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err); // Trece eroarea la Express
    }
});

// --- Metodă pentru Compararea parolelor ---
UserSchema.methods.matchPassword = async function(enteredPassword) {
    // Compară parola introdusă cu hash-ul stocat
    return await bcrypt.compare(enteredPassword, this.password);
};


const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;