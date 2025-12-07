// models/GrillModel.js

const mongoose = require('mongoose');

const GrillSchema = new mongoose.Schema({
    // Proprietarul postării. Referă la UserModel
    creator_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    name: {
        type: String,
        required: [true, "Numele grătarului este obligatoriu."],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Descrierea grătarului este obligatorie."],
    },
    mics_count: { 
        type: Number,
        default: 0
    }
}, { timestamps: true });

const GrillModel = mongoose.model('Grill', GrillSchema);

module.exports = GrillModel;