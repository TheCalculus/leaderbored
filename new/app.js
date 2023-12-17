var express = require("express");
var app     = express();

require('./templates')(app);

app.set("views", "./views");
app.set("view engine", "html");

app.get("/", function (req, res) {
    res.render("index", {
        favorite: "Eta",
        name: "Ben",
        reasons: ["fast", "lightweight", "simple"]
    });
});

app.listen(8000, function () {
    console.log("listening to requests on port 8000");
});

module.exports = app;
