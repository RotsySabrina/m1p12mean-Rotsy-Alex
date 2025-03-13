const Vehicule = require("../models/Vehicule");

//Ajout
exports.addVehicule = async(req, res) =>{
    try {
        console.log("Requête reçue :", req.body);
        const {marque, modele, immatriculation, annee} = req.body;

        const newVehicule = new Vehicule({
            id_user: req.user.id,
            marque,
            modele,
            immatriculation,
            annee
        });

        await newVehicule.save();
        res.status(210).json({message: "Véhicule ajouté avec succès !"});
    } catch (error) {
        res.status(500).json({message: "Erreur serveur", error});
    }
};

//Select all by id_user
exports.getUserVehicules = async (req, res) =>{
    try {
        const vehicules = await Vehicule.find({id_user: req.user.id});
        res.status(200).json(vehicules);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//update
exports.updateVehicule = async (req, res) =>{
    try {
        console.log(req.body, req.params.id);
        const{marque, modele, immatriculation, annee} = req.body;

        const updatedVehicule = await Vehicule.findByIdAndUpdate(
            req.params.id,
            {marque, modele, immatriculation, annee},
            {new : true}
        );

        if(!updatedVehicule){
            return res.status(404).json({ message: "Véhicule non trouvé" });
        }
        res.status(200).json({ message: "Véhicule mis à jour avec succès", updatedVehicule });
    } catch (error) {
        console.error("Erreur:", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

//delete
exports.deleteVehicule = async (req, res) =>{
    try {
        await Vehicule.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Véhicule supprimé !" }); 
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
}