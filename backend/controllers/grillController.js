// controllers/grillController.js

const GrillModel = require('../models/GrillModel');
const LikeModel = require('../models/LikeModel');
const mongoose = require('mongoose'); // Necesită mongoose pentru a verifica ID-urile

// ----------------------------------------------------------------------
// FUNCTII DE BAZA (POST, GET, LEADERBOARD)
// ----------------------------------------------------------------------

// @desc    Adaugă un grătar nou
// @route   POST /api/grills
// @access  Private (necesită token)
exports.addGrill = async (req, res) => {
    const { name, description } = req.body;
    
    if (!name || !description) {
        return res.status(400).json({ message: "Numele și descrierea grătarului sunt obligatorii." });
    }

    try {
        const newGrill = await GrillModel.create({
            creator_id: req.user._id, // ID-ul utilizatorului autentificat din token
            name,
            description,
        });

        res.status(201).json({ 
            message: "Grătar postat cu succes!", 
            grill: newGrill 
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Eroare la adăugarea grătarului", 
            error: error.message 
        });
    }
};

// @desc    Listează toate grătarele (Grills for pimps)
// @route   GET /api/grills
// @access  Public
exports.getAllGrills = async (req, res) => {
    try {
        // Sortăm după data creării (cele mai noi primele)
        const grills = await GrillModel.find({})
            .sort({ createdAt: -1 })
            // Puteți adăuga .populate('creator_id', 'full_name') pentru Frontend
        
        res.json(grills);
    } catch (error) {
        res.status(500).json({ message: "Eroare la preluarea grătarelor.", error: error.message });
    }
};

// @desc    Listează top 3 grătare (THE BEST GRILLS - Leaderboard)
// @route   GET /api/grills/best
// @access  Public
exports.getBestGrills = async (req, res) => {
    try {
        // Sortăm descrescător după mics_count și limităm la 3
        const bestGrills = await GrillModel.find({})
            .sort({ mics_count: -1 }) 
            .limit(3); 

        res.json(bestGrills);
    } catch (error) {
        res.status(500).json({ message: "Eroare la preluarea Leaderboard-ului.", error: error.message });
    }
};

// ----------------------------------------------------------------------
// FUNCTIE LIKE (MICI) - RĂSPUNS LA PROBLEMA TA
// ----------------------------------------------------------------------

// @desc    Dă sau ia un MIC (Toggle Like)
// @route   POST /api/grills/:id/like
// @access  Private (necesită token)
exports.toggleLike = async (req, res) => {
    const grillId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(grillId)) {
        return res.status(400).json({ message: "ID-ul grătarului este invalid." });
    }

    try {
        // Căutăm dacă utilizatorul a dat deja like (pentru a implementa UNLIKE)
        const existingLike = await LikeModel.findOne({ user_id: userId, grill_id: grillId });

        if (existingLike) {
            // UNLIKE (Scoate MIC)
            await existingLike.deleteOne();
            // Decrementează atomically mics_count pe Grill
            await GrillModel.findByIdAndUpdate(grillId, { $inc: { mics_count: -1 } });

            res.json({ action: 'unliked', message: "MIC scos. Rating actualizat." });
        } else {
            // LIKE (Dă MIC)
            const grill = await GrillModel.findById(grillId);
            if (!grill) {
                return res.status(404).json({ message: "Grătarul nu a fost găsit." });
            }

            // Creează noul like
            await LikeModel.create({ user_id: userId, grill_id: grillId });
            // Incrementează atomically mics_count pe Grill
            await GrillModel.findByIdAndUpdate(grillId, { $inc: { mics_count: 1 } });

            res.json({ action: 'liked', message: "MIC adăugat. Rating actualizat." });
        }
    } catch (error) {
        res.status(500).json({ message: "Eroare la procesarea MIC-ului.", error: error.message });
    }
};


// ----------------------------------------------------------------------
// FUNCTII BONUS (EDIT/DELETE)
// ----------------------------------------------------------------------

// @desc    Editează un grătar postat (doar de către creator)
// @route   PUT /api/grills/:id
// @access  Private (Owner only)
exports.updateGrill = async (req, res) => {
    const grillId = req.params.id;
    const { name, description } = req.body;

    try {
        const grill = await GrillModel.findById(grillId);

        if (!grill) return res.status(404).json({ message: "Grătarul nu a fost găsit." });

        // Verifică Ownership
        if (grill.creator_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Nu ești autorizat să editezi acest grătar." });
        }

        // Aplică modificările
        grill.name = name || grill.name;
        grill.description = description || grill.description;

        const updatedGrill = await grill.save();
        res.json({ message: "Grătar actualizat cu succes", grill: updatedGrill });

    } catch (error) {
        res.status(500).json({ message: "Eroare la actualizarea grătarului.", error: error.message });
    }
};


// @desc    Șterge un grătar postat (Owner sau Admin)
// @route   DELETE /api/grills/:id
// @access  Private (Owner sau Admin)
exports.deleteGrill = async (req, res) => {
    const grillId = req.params.id;

    try {
        const grill = await GrillModel.findById(grillId);

        if (!grill) return res.status(404).json({ message: "Grătarul nu a fost găsit." });

        // 1. Verifică Autorizarea (Owner SAU Admin)
        const isOwner = grill.creator_id.toString() === req.user._id.toString();
        // Presupunem că rolul userului este atașat la req.user de către middleware
        const isAdmin = req.user.role === 'admin'; 

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Nu ești autorizat să ștergi acest grătar." });
        }

        // 2. Șterge grătarul și toate like-urile asociate
        await GrillModel.deleteOne({ _id: grillId });
        await LikeModel.deleteMany({ grill_id: grillId }); 

        res.json({ message: "Grătar șters cu succes." });

    } catch (error) {
        res.status(500).json({ message: "Eroare la ștergerea grătarului.", error: error.message });
    }
};