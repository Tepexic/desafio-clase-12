// socket
const { Server: SocketServer } = require("socket.io");

const Productos = require("./../models/productos");
const Mensajes = require("./../models/mensajes");

const createSocket = (httpServer) => {
  const io = new SocketServer(httpServer);

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
};

module.exports = createSocket;
