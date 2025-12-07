// import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config;

// application

const app = express();

// database

mongoose.connect("mogodb://127.0.0.1:27017/setup-proba")
    .then(() => {
        console.log("App is connected to MongoDB");
    })
    .catch(error => console.error(error));

const BauturaSchema = mongoose.Schema({
    name: String,
    gradAlcoolemie: Number,
});

const BauturaModel = mongoose.model('bautura', BauturaSchema);

const router = require('express').Router;
route.post("/bautura", async(req, res) => {
    try{
        const bautura = new BauturaModel({
            name: "Bere",
            gradAlcoolemie: 4
        });
        await bautura.save;
        res.status(201).json({message: "Bautura salvata cu succes"});
    }catch(error){
        res.status(500).json({error: "Eroare la creearea bauturii"});
    }
})

app.use("/api", router);

// middleware

app.use(morgan('dev'));
app.use(cors({origin: true, credentials: true}));
app.use(express.json());

// routes

// port
const port = process.env.PORT || 3001;

const server = app.listen(
    port,
    () => console.log("App is running on port", port)
);