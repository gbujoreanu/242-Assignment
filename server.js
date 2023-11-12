const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let albums = [
    {
        _id: 1,
        name: "Thriller",
        artist: "Michael Jackson",
        releaseYear: 1982,
        genre: "Pop, Post-Disco, Funk",
        description: "One of the best-selling albums of all time, featuring hits like 'Beat It' and 'Billie Jean'.",
        songs: ["Wanna Be Startin' Somethin'", "Thriller", "Beat It", "Billie Jean", "Human Nature", "P.Y.T. (Pretty Young Thing)"]
    },
    {
        _id: 2,
        name: "A Night at the Opera",
        artist: "Queen",
        releaseYear: 1975,
        genre: "Rock, Pop, Progressive Rock",
        description: "A landmark album in rock music history, featuring the iconic song 'Bohemian Rhapsody'.",
        songs: ["Bohemian Rhapsody", "Love of My Life", "You're My Best Friend", "Death on Two Legs", "I'm in Love with My Car"]
    },
    {
        _id: 3,
        name: "Night Visions",
        artist: "Imagine Dragons",
        releaseYear: 2012,
        genre: "Alternative Rock, Indie Rock, Electropop",
        description: "Debut album known for its breakthrough single 'Radioactive'.",
        songs: ["Radioactive", "Demons", "On Top of the World", "It's Time", "Hear Me", "Amsterdam"]
    },
    {
        _id: 4,
        name: "Parachutes",
        artist: "Coldplay",
        releaseYear: 2000,
        genre: "Alternative Rock, Post-Britpop",
        description: "The debut album that brought Coldplay into the limelight with 'Yellow'.",
        songs: ["Yellow", "Shiver", "Don't Panic", "Spies", "Trouble", "High Speed"]
    },
    {
        _id: 5,
        name: "Native",
        artist: "OneRepublic",
        releaseYear: 2013,
        genre: "Pop Rock, Pop",
        description: "Known for its hit singles like 'Counting Stars' and 'If I Lose Myself'.",
        songs: ["Counting Stars", "If I Lose Myself", "Feel Again", "What You Wanted", "I Lived", "Light It Up"]
    }
];

app.get("/api/albums", (req, res) => {
    res.send(albums);
});

app.post("/api/albums", upload.single("cover"), (req, res) => {
    const result = validateAlbum(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const album = {
        _id: albums.length + 1,
        name: req.body.name,
        artist: req.body.artist,
        releaseYear: req.body.releaseYear,
        genre: req.body.genre,
        description: req.body.description,
        songs: req.body.songs.split(",") 
    }

    albums.push(album);
    res.send(albums);
});

const validateAlbum = (album) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        artist: Joi.string().min(3).required(),
        releaseYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
        genre: Joi.string().min(3).required(),
        description: Joi.string().min(5),
        songs: Joi.allow("") 
    });

    return schema.validate(album);
};

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
