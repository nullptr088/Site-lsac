// controllers/userController.js

// @desc    Obține detaliile profilului utilizatorului autentificat
// @route   GET /api/user/profile
// @access  Private (necesită token)
exports.getUserProfile = async (req, res) => {
    // Datorită middleware-ului 'protect', utilizatorul este deja atașat la req.user
    if (req.user) {
        res.json({
            _id: req.user._id,
            full_name: req.user.full_name,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role,
            // Aici vei adăuga și postările userului mai târziu
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};