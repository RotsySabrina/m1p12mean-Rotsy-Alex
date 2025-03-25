const MecanicienDisponible = require('../models/MecanicienDisponible');

// Créer une nouvelle disponibilité

exports.addMecanicienDisponible = async (req, res) => {
  try {
    const { id_user, date_debut, date_fin, status } = req.body;
    const newMecanicienDisponible = new MecanicienDisponible({
      id_user,
      date_debut,
      date_fin,
      status
    });
    await newMecanicienDisponible.save();
    res.status(210).json({ message: "Regle ajouté avec succès !" })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer toutes les disponibilités
exports.getDisponibilites = async (req, res) => {
    try {
        const disponibilites = await MecanicienDisponible.find().populate('id_user');
        res.status(200).json(disponibilites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer une disponibilité par ID
exports.getDisponibiliteById = async (req, res) => {
    try {
        const disponibilite = await MecanicienDisponible.findById(req.params.id).populate('id_user');
        if (!disponibilite) {
            return res.status(404).json({ message: 'Disponibilité non trouvée' });
        }
        res.status(200).json(disponibilite);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour une disponibilité
exports.updateDisponibilite = async (req, res) => {
    try {
        const disponibilite = await MecanicienDisponible.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!disponibilite) {
            return res.status(404).json({ message: 'Disponibilité non trouvée' });
        }
        res.status(200).json(disponibilite);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer une disponibilité
exports.deleteDisponibilite = async (req, res) => {
    try {
        const disponibilite = await MecanicienDisponible.findByIdAndDelete(req.params.id);
        if (!disponibilite) {
            return res.status(404).json({ message: 'Disponibilité non trouvée' });
        }
        res.status(200).json({ message: 'Disponibilité supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};