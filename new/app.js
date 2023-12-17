const { initializeApp, applicationDefault, cert } = require('firebase/app');
const { getFirestore, collection, doc, addDoc, setDoc } = require('firebase/firestore');
const bodyParser     = require("body-parser");
const express        = require("express");
const multer         = require('multer');
const upload         = multer();
const { v4: uuidv4 } = require('uuid');
const templates      = require("./templates");

const firebaseConfig = {
    apiKey: "AIzaSyAIzsUMpUC6_zSlZtTHLmiA5UGlYZl3CPY",
    authDomain: "leaderbored-c1ea2.firebaseapp.com",
    projectId: "leaderbored-c1ea2",
    storageBucket: "leaderbored-c1ea2.appspot.com",
    messagingSenderId: "1043865417419",
    appId: "1:1043865417419:web:970c2594274dc4d2798d4e",
    measurementId: "G-18P8KDGWMY"
};

initializeApp(firebaseConfig);
const db  = getFirestore();
const app = express();
templates(app);

app.set("views", "./views");
app.set("view engine", "html");

app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/board/:id", (req, res) => {
    let board_id = req.params["id"];

    if (board_id == null ||
        board_id == undefined) {
        // authenticate leaderboard id
        res.render("leaderboard");
    }
});

app.post("/board/create", upload.fields([]), (req, res) => {
    let name = req.body["name"];
    let uuid = uuidv4();

    console.log(req.body, req.files, name);

    const boardcol = collection(db, uuid);
    const docref   = setDoc(doc(boardcol, "board"), {
        name: name,
        owner: "",
        participants: 0,
        description: "",
        settings: ""
    });

    res.send({ 'message': 'success' });
});

app.listen(8000, function () {
    console.log("listening to requests on port 8000");
});

module.exports = app;
