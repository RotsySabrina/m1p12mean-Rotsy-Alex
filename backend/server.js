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

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/vehicules", require("./routes/VehiculeRoutes"));
app.use("/api/rendez_vous_client", require("./routes/RendezVousClientRoutes"));
app.use("/api/mecaniciens", require("./routes/MecanicienRoutes"));
app.use("/api/mecanicien_disponibles", require("./routes/MecanicienDisponibleRoutes"))
app.use('/categorie_services', require('./routes/CategorieServiceRoutes'));
app.use('/services', require('./routes/ServiceRoutes'));
app.use("/api/creneaux", require("./routes/CreneauxRoutes"));



app.listen(PORT, () => { console.log(`Serveur en cours sur http://localhost:${PORT}`); });

