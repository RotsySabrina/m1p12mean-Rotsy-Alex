const express = require('express');
const router = express.Router();
const CategorieService = require('../models/CategorieService');

// Créer un categorie_service
router.post('/', async (req, res) => {
    try {
        const categorie = new CategorieService(req.body);
        await categorie.save();
        res.status(201).json(categorie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lire tous les categorie_service
router.get('/', async (req, res) => {
    try {
        const categories = await CategorieService.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// // Mettre à jour un catégorie
router.put('/:id', async (req, res) => {
    try {
        const categorie = await CategorieService.findByIdAndUpdate(req.params.id,
            req.body, { new: true });
        res.json(categorie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// // Supprimer un categorie
router.delete('/:id', async (req, res) => {
    try {
        await CategorieService.findByIdAndDelete(req.params.id);
        res.json({ message: "Categorie supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;