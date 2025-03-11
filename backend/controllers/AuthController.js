const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) =>{
    try {
        const {nom, prenom, email, mot_de_passe, role}=req.body;

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({email});
        if (userExists) return res.status(400).json({message: "Cet email est déjà utilisé."});
        
        const hashedPassword = await bcrypt.hash(mot_de_passe,10);

        const newUser = new User({
            nom,
            prenom,
            emaill,
            mot_de_passe: hashedPassword,
            role 
        });

        await newUser.save();
        res.status(201).json({message : "Utilisateur créé avec succès !"});
    } catch (error) {
        res.status(500).json({message: "Erreur serveur", error });
    }
};

exports.login = async (req, res) =>{
    try {
        const {email, mot_de_passe} = req.body;

        const user = await User.findOne({email});
        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé." });

        const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isMatch) return res.status(400).json({message: "Mot de passe incorrect ."});

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1d"});
        
        res.status(200).json({message: "Connexion réussie", token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};