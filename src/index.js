const express = require("express");
const productos = require("./routers/productos");

const { Server: HttpServer } = require("http");

const app = express();
const httpServer = new HttpServer(app);
const socket = require("./services/socket");
socket(httpServer);

// middleware
app.use(express.json());
app.use(express.urlencoded({ encoded: true }));

// Usar rutas y exponer public
app.use("/productos/", productos);
app.use(express.static("./src/public"));

// Servir index.html en la raíz
app.get("/", (req, res) => {
  res.render("./src/public/index");
});

const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
  console.log(
    `Servidor Http con Websockets escuchando en el puerto ${
      connectedServer.address().port
    }`
  );
});
connectedServer.on("error", (error) =>
  console.log(`Error en servidor ${error}`)
);
