const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");
const MecanicienSpecialiste = require("../models/MecanicienSpecialiste");

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


