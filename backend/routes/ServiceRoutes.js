const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Créer un service
router.post('/', async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lire tous les services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find().populate('id_categorie_service', 'description'); // Peupler la catégorie associée
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lire un service par ID
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('id_categorie_service');
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour un service
router.put('/:id', async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }
        res.json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un service
router.delete('/:id', async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }
        res.json({ message: 'Service supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
