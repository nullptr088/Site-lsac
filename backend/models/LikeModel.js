// models/LikeModel.js

const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    // ID-ul utilizatorului care a dat like (MIC)
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    // ID-ul grătarului care a primit like-ul
    grill_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Grill'
    }
}, { timestamps: true });

// Asigură că un utilizator poate da like o singură dată la un singur grătar
LikeSchema.index({ user_id: 1, grill_id: 1 }, { unique: true });

const LikeModel = mongoose.model('Like', LikeSchema);

module.exports = LikeModel;