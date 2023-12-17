const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, 
    addDoc, setDoc, getDoc, getDocs,
    query, where } 
    = require("firebase/firestore");
const bodyParser     = require("body-parser");
const express        = require("express");
const multer         = require("multer");
const upload         = multer();
const { v4: uuidv4 } = require("uuid");
const templates      = require("./templates");
const res = require("express/lib/response");

const PORT = 8000;

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

// configure nunjucks as templating engine, 
// clear the (nunjuck) cache each initialisation
templates(app);

app.set("views", "./views");
app.set("view engine", "html");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/board/:id", async (req, res) => {
    let boardID = req.params["id"];

    if (boardID == null ||
        boardID == undefined) {
        res.status(404);
    }
        
    const collRef = collection(db, boardID);

    try {
        const query = await getDocs(collRef);

        if (query.length == 0) {
            res.render("404");
            return;
        }
    } catch (e) {
        console.error(e);
        res.status(500);
        return;
    }

    // the namings a little bit weird, but the intention was to convey 
    // that this data is perfectly safe to hand over
    const safeSnapshot = (await getDoc(doc(db, boardID, "board"))).data();

    res.render("leaderboard", { boardID: boardID, boardData: safeSnapshot });
});

app.post("/board/create", upload.fields([]), (req, res) => {
    const name = req.body["name"];
    const uuid = uuidv4();

    const boardColl = collection(db, uuid);
    
    setDoc(doc(boardColl, "board"), {
        name: name,
        owner: "",
        participants: 0,
        description: "",
        settings: ""
    }).catch(e => {
        console.error(e);
        res.send({ "message": "failure" });
        return;
    });

    res.send({ "message": "success" });
});

app.post("/player/new", upload.fields([]), async (req, res) => {
    const board  = req.body["boardID"];
    const name   = req.body["name"];
    const points = req.body["points"];

    if (!(await newPlayer(board, name, points))) {
        res.send({ "message": "failure"});
        return;
    };

    res.send({ "message": "success" });
});

async function newPlayer(boardID, playerName, initialPoints) {
    const uuid      = uuidv4();
    const boardColl = collection(db, boardID);

    const q = query(boardColl, where("name", "==", playerName));

    if ((await getDocs(q)).size !== 0) {
        // duplicate username
        return false;
    }
    
    setDoc(doc(boardColl, uuid), {
        name: playerName,
        points: initialPoints,
        ranking: 0
    }).catch(e => {
        console.error(e);
        return false;
    });

    return true;
}

app.listen(PORT, function () {
    console.log("listening to requests on port 8000");
});

module.exports = app;
