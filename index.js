/**
 * Consigna 1:   Modificar el último entregable para que disponga de un canal de websocket que permita representar,
 * por debajo del formulario de ingreso, una tabla con la lista de productos en tiempo real.
 * Puede haber varios clientes conectados simultáneamente y en cada uno de ellos se reflejarán los cambios que se
 * realicen en los productos sin necesidad de recargar la vista. Cuando un cliente se conecte, recibirá la lista
 * de productos a representar en la vista.
 *
 * Para construir la tabla dinámica con los datos recibidos por websocket utilizar Handlebars en el frontend.
 * Considerar usar archivos públicos para alojar la plantilla vacía, y obtenerla usando la función fetch( ).
 * Recordar que fetch devuelve una promesa.
 */

/**
 * Consigna 2:  Añadiremos al proyecto un canal de chat entre los clientes y el servidor.
 * Aspectos a incluir en el entregable:
 * En la parte inferior del formulario de ingreso se presentará el centro de mensajes almacenados en el servidor,
 * donde figuren los mensajes de todos los usuarios identificados por su email.
 * El formato a representar será: email (texto negrita en azul) [fecha y hora (DD/MM/YYYY HH:MM:SS)]
 * - (texto normal en marrón) : mensaje (texto italic en verde)
 * Además incorporar dos elementos de entrada: uno para que el usuario ingrese su email
 * (obligatorio para poder utilizar el chat) y otro para ingresar mensajes y enviarlos mediante un botón. Los mensajes deben persistir en el servidor en un archivo (ver segundo entregable) .
 */

const express = require("express");
const productos = require("./routes/productos");
const { Server: SocketServer } = require("socket.io");
const { Server: HttpServer } = require("http");

const Contenedor = require("./utils/Contenedor");
const Productos = new Contenedor("./routes/data/productos.json");
const Mensajes = new Contenedor("./model/data/messages.json");

const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

// middleware
app.use(express.json());
app.use(express.urlencoded({ encoded: true }));

// Usar rutas y exponer public
app.use("/productos/", productos);
app.use(express.static("public"));

// socket
io.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado", socket.id);
  // Emitir mensajes y prouctos al nuevo socket
  socket.emit("productos", await Productos.getAll());
  socket.emit("messages", await Mensajes.getAll());

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
