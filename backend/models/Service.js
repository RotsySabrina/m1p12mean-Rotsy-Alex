const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    description: { type: String, required: true },
    cout: { type: Number, required: true },
    id_categorie_service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategorieService', required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
