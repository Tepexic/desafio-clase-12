const Contenedor = require("./../controllers/Contenedor");
const prodOptions = require("./../../data/sqliteOptions");
const Productos = new Contenedor(prodOptions.options, "products");

module.exports = Productos;
