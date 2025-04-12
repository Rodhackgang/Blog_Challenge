const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Email invalide' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Utilisateur déjà enregistré' });
        }
        const newUser = new User({
            name,
            email,
            password,
        });
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur inscrit avec succès' });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '100y' });

        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
