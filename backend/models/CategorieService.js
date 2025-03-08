const mongoose = require('mongoose');

const CategorieServiceSchema = new mongoose.Schema({
    description: { type: String, required: true },

}, { timestamps: true });

module.exports = mongoose.model('CategorieService', CategorieServiceSchema);