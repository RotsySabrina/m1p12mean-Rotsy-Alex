const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Connection à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté"))
  .catch(err => console.log(err));

// app.get("/", (req, res) => {
//   res.send("API en ligne 🚀");
// });

// Routes

app.use("/api/auth", require("./routes/AuthRoutes"));

app.use("/api/vehicules", require("./routes/VehiculeRoutes"));
app.use("/api/rendez_vous_client", require("./routes/RendezVousClientRoutes"));
app.use("/api/mecaniciens", require("./routes/MecanicienRoutes"));
app.use("/api/mecanicien_disponibles", require("./routes/MecanicienDisponibleRoutes"))
app.use('/categorie_services', require('./routes/CategorieServiceRoutes'));
app.use('/services', require('./routes/ServiceRoutes'));
app.use("/api/creneaux", require("./routes/CreneauxRoutes"));
app.use("/api/devis", require("./routes/DevisRoutes"));
app.use("/api/rdv_services", require("./routes/RendezVousServiceRoutes"));
app.use("/api/reparations", require("./routes/ReparationRoutes"));
app.use("/api/reparation_services", require("./routes/ReparationServiceRoutes"));
app.use("/api/facture", require("./routes/FactureRoutes"));
app.use("/api/notifications", require("./routes/NotificationRoutes"));

app.listen(PORT, () => { console.log(`Serveur en cours sur http://localhost:${PORT}`); });

