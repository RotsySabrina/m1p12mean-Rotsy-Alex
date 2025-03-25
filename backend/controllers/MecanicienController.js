const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");
const MecanicienSpecialiste = require("../models/MecanicienSpecialisation");

exports.addMecanicien = async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe, specialisations } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

        // Créer le mécanicien
        const newMecanicien = new User({
            nom,
            prenom,
            email,
            mot_de_passe: hashedPassword,
            role: "mecanicien"
        });

        // Insérer le mécanicien dans la base de données
        const savedMecanicien = await newMecanicien.save();

        // Préparer les spécialisations
        const specialisationDocs = specialisations && specialisations.length > 0
            ? specialisations.map(spec => ({
                id_user: savedMecanicien._id,
                id_categorie_service: spec
            }))
            : [];

        // Effectuer l'insertion du mécanicien et des spécialisations en parallèle
        const insertSpecialisations = specialisationDocs.length > 0
            ? MecanicienSpecialiste.insertMany(specialisationDocs)
            : Promise.resolve();  // Si pas de spécialisations, ne rien faire

        // Attendre que les deux opérations se terminent
        await Promise.all([insertSpecialisations]);

        res.status(201).json({ message: "Mécanicien ajouté avec succès !" });

    } catch (error) {
        console.error("Erreur interne serveur:", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Récupérer tous les mécaniciens avec leurs spécialisations
exports.getAllMecaniciens = async (req, res) => {
    try {
        // Récupérer les mécaniciens
        const mecaniciens = await User.find({ role: "mecanicien" });

        // Récupérer les spécialisations associées
        const mecaniciensWithSpecialisations = await Promise.all(
            mecaniciens.map(async (mecanicien) => {
                const specialisations = await MecanicienSpecialiste.find({ id_user: mecanicien._id })
                    .populate("id_categorie_service", "description"); // Récupère le nom de la spécialisation

                return {
                    ...mecanicien.toObject(),
                    specialisations: specialisations.map(spec => ({
                        id: spec._id,
                        categorie_service: spec.id_categorie_service.description // Nom de la spécialisation
                    }))
                };
            })
        );

        res.status(200).json(mecaniciensWithSpecialisations);
    } catch (error) {
        console.error("Erreur interne serveur:", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Mettre à jour un mécanicien
exports.updateMecanicien = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, email, mot_de_passe, specialisations } = req.body;

        // Vérifier si le mécanicien existe
        const mecanicien = await User.findById(id);
        if (!mecanicien) {
            return res.status(404).json({ message: "Mécanicien non trouvé." });
        }

        // Mettre à jour les informations du mécanicien
        mecanicien.nom = nom || mecanicien.nom;
        mecanicien.prenom = prenom || mecanicien.prenom;
        mecanicien.email = email || mecanicien.email;

        // Si un nouveau mot de passe est fourni, le hacher avant de l'enregistrer
        if (mot_de_passe) {
            const salt = await bcrypt.genSalt(10);
            mecanicien.mot_de_passe = await bcrypt.hash(mot_de_passe, salt);
        }

        await mecanicien.save();

        // Mettre à jour les spécialisations
        if (specialisations) {
            await MecanicienSpecialiste.deleteMany({ id_user: id }); // Supprimer les anciennes spécialités
            const specialisationDocs = specialisations.map(spec => ({
                id_user: id,
                id_categorie_service: spec
            }));
            await MecanicienSpecialiste.insertMany(specialisationDocs);
        }

        res.status(200).json({ message: "Mécanicien mis à jour avec succès !" });

    } catch (error) {
        console.error("Erreur interne serveur:", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Supprimer un mécanicien
exports.deleteMecanicien = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si le mécanicien existe
        const mecanicien = await User.findById(id);
        if (!mecanicien) {
            return res.status(404).json({ message: "Mécanicien non trouvé." });
        }

        // Supprimer le mécanicien et ses spécialisations
        await User.findByIdAndDelete(id);
        await MecanicienSpecialiste.deleteMany({ id_user: id });

        res.status(200).json({ message: "Mécanicien supprimé avec succès !" });

    } catch (error) {
        console.error("Erreur interne serveur:", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};


