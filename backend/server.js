// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// //Connection à MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log("MongoDB connecté"))
//   .catch(err => console.log(err));

// // app.get("/", (req, res) => {
// //   res.send("API en ligne 🚀");
// // });

// // Routes

// app.use("/api/auth", require("./routes/authRoutes"));

// app.use("/api/vehicules", require("./routes/VehiculeRoutes"));
// app.use("/api/rendez_vous_client", require("./routes/RendezVousClientRoutes"));
// app.use("/api/mecaniciens", require("./routes/MecanicienRoutes"));
// app.use("/api/mecanicien_disponibles", require("./routes/MecanicienDisponibleRoutes"))
// app.use('/categorie_services', require('./routes/CategorieServiceRoutes'));
// app.use('/services', require('./routes/ServiceRoutes'));
// app.use("/api/creneaux", require("./routes/CreneauxRoutes"));
// app.use("/api/devis", require("./routes/DevisRoutes"));
// app.use("/api/rdv_services", require("./routes/RendezVousServiceRoutes"));
// app.use("/api/reparations", require("./routes/ReparationRoutes"));
// app.use("/api/reparation_services", require("./routes/ReparationServiceRoutes"));


// app.listen(PORT, () => { console.log(`Serveur en cours sur http://localhost:${PORT}`); });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*"
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 📌 Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connecté ✅"))
  .catch(err => console.log("Erreur MongoDB ❌", err));

// 🔌 Gestion des connexions Socket.IO
const users = {}; // Stocker les connexions des utilisateurs

io.on("connection", (socket) => {
  console.log(`🔗 Utilisateur connecté : ${socket.id}`);

  // Associer un utilisateur à son ID Socket.IO
  socket.on("join", (userId) => {
    users[userId] = socket.id;
    console.log(`👤 Utilisateur ${userId} a rejoint avec le socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Déconnexion de ${socket.id}`);
    Object.keys(users).forEach(userId => {
      if (users[userId] === socket.id) {
        delete users[userId];
      }
    });
  });
});

// 📌 Injection de `io` dans `req`
app.use((req, res, next) => {
  req.io = io;
  req.users = users;
  next();
});

// 🛣️ Définition des routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vehicules", require("./routes/VehiculeRoutes"));
app.use("/api/rendez_vous_client", require("./routes/RendezVousClientRoutes"));
app.use("/api/mecaniciens", require("./routes/MecanicienRoutes"));
app.use("/api/mecanicien_disponibles", require("./routes/MecanicienDisponibleRoutes"));
app.use('/categorie_services', require('./routes/CategorieServiceRoutes'));
app.use('/services', require('./routes/ServiceRoutes'));
app.use("/api/creneaux", require("./routes/CreneauxRoutes"));
app.use("/api/devis", require("./routes/DevisRoutes"));
app.use("/api/rdv_services", require("./routes/RendezVousServiceRoutes"));
app.use("/api/reparations", require("./routes/ReparationRoutes"));
app.use("/api/reparation_services", require("./routes/ReparationServiceRoutes"));

// 🚀 Lancer le serveur
server.listen(PORT, () => {
  console.log(`✅ Serveur en cours sur http://localhost:${PORT}`);
});