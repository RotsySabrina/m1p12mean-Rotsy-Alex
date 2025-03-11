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

app.use('/categorie_services', require('./routes/categorie_serviceRoutes'));

app.listen(PORT, () => { console.log(`Serveur en cours sur http://localhost:${PORT}`); });

