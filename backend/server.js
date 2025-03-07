const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

//Connection à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("MongoDB connecté"))
    .catch(err => console.log(err));

  app.get("/", (req, res) => {
    res.send("API en ligne 🚀");
  });

  app.listen(PORT, () =>{
    console.log(`Serveur en cours sur http://localhost:${PORT}`);
  });

