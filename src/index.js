const express = require("express");
const productos = require("./routers/productos");
const { Server: SocketServer } = require("socket.io");
const { Server: HttpServer } = require("http");

const Productos = require("./models/productos");
const Mensajes = require("./models/mensajes");

const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

// middleware
app.use(express.json());
app.use(express.urlencoded({ encoded: true }));

// Usar rutas y exponer public
app.use("/productos/", productos);
app.use(express.static("./src/public"));

// socket
io.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado", socket.id);
  // Emitir mensajes y prouctos al nuevo socket
  socket.emit("productos", await Productos.getAll());
  socket.emit("messages", await Mensajes.getAll());

  // Añadir nuevo mensaje y emitir nueva lista
  socket.on("new-message", async (data) => {
    await Mensajes.save(data);
    socket.emit("messages", await Mensajes.getAll());
  });

  // Añadir nuevo producto y emitir nueva lista
  socket.on("new-product", async (data) => {
    await Productos.save(data);
    socket.emit("productos", await Productos.getAll());
  });
});

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
