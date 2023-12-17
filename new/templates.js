var nunjucks   = require("nunjucks");
module.exports = function (app) {
    var env = nunjucks.configure("./views", {
        autoescape: true,
        express   : app
    });
}
