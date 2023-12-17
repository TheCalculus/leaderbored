var nunjucks = require("nunjucks");

module.exports = function (app) {
    var env = nunjucks.configure("./views", {
        autoescape: true,
        express   : app
    });

    for (let i = 0; i < env.loaders.length; i += 1) {
        // clear nunjucks cache for development
        env.loaders[i].cache = {};
    }
}
