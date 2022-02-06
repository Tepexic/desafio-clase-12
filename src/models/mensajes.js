const Contenedor = require("./../controllers/Contenedor");
const msgOptions = require("./../../data/sqliteOptions");

const Mensajes = new Contenedor(msgOptions.options, "messages");

module.exports = Mensajes;
