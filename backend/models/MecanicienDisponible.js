const mongoose = require('mongoose');

const MecanicienDisponibleSchema = new mongoose.Schema({
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    status: { type: Number, enum: [1, 0, 5], required: true }
}, { timestamps: true });

module.exports = mongoose.model('MecanicienDisponible', MecanicienDisponibleSchema);