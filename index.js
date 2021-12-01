const express = require("express");
const productos = require("./routes/productos");
const { Server: SocketServer } = require("socket.io");
const { Server: HttpServer } = require("http");

const Contenedor = require("./utils/Contenedor");
const Productos = new Contenedor("./routes/data/productos.json");
const Mensajes = new Contenedor("./model/data/messages.json");

const { normalizeMessages } = require("./utils/normalizador");

const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

// middleware
app.use(express.json());
app.use(express.urlencoded({ encoded: true }));

// Usar rutas y exponer public
app.use("/api/", productos);
app.use(express.static("public"));

// socket
io.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado", socket.id);
  // Emitir mensajes y prouctos al nuevo socket
  socket.emit("productos", await Productos.getAll());

  socket.emit(
    "messages",
    normalizeMessages({ id: "messages", messages: await Mensajes.getAll() })
  );

  // Añadir nuevo mensaje y emitir nueva lista
  socket.on("new-message", async (data) => {
    Mensajes.save(data);
    socket.emit("messages", await Mensajes.getAll());
  });

  // Añadir nuevo producto y emitir nueva lista
  socket.on("new-product", async (data) => {
    Productos.save(data);
    socket.emit("productos", await Productos.getAll());
  });
});

// Servir index.html en la raíz
app.get("/", (req, res) => {
  res.render("public/index");
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
