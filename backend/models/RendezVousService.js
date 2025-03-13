const mongoose = require("mongoose");

const RendezVousServiceSchema = new mongoose.Schema({
  id_rendez_vous_client: { type: mongoose.Schema.Types.ObjectId, ref: "RendezVousClient", required: true },
  id_service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
});

module.exports = mongoose.model("RendezVousService", RendezVousServiceSchema);
