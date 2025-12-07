// routes/grillRoutes.js

const express = require('express');
const router = express.Router();
// Asigură-te că authMiddleware.js este în directorul ../middleware/
const { protect } = require('../middleware/authMiddleware'); 
const { 
    addGrill,       
    getAllGrills,   // ❗ Funcția pentru GET /api/grills
    getBestGrills,  // ❗ Funcția pentru GET /api/grills/best
    toggleLike,     
    updateGrill,
    deleteGrill
} = require('../controllers/grillController'); // Asigură-te că grillController.js este corect

// Rute PUBLICE (GET)
// Adresa finală: GET /api/grills
router.get('/', getAllGrills);             

// Adresa finală: GET /api/grills/best
router.get('/best', getBestGrills);        

// Rute PROTEJATE (necesită token)
// Adresa finală: POST /api/grills
router.post('/', protect, addGrill);               

// Adresa finală: POST /api/grills/:id/like
router.post('/:id/like', protect, toggleLike);     

// Adresa finală: PUT /api/grills/:id
router.put('/:id', protect, updateGrill);          

// Adresa finală: DELETE /api/grills/:id
router.delete('/:id', protect, deleteGrill);       

module.exports = router;