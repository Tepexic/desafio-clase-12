const express = require("express");
const productos = require("./routes/productos");
const { Server: SocketServer } = require("socket.io");
const { Server: HttpServer } = require("http");

const session = require("express-session");
const auth = require("./utils/auth");
const MongoStore = require("connect-mongo");

/**
 * Contenedores
 */
const Contenedor = require("./utils/Contenedor");
const Productos = new Contenedor("./routes/data/productos.json");
const Mensajes = new Contenedor("./model/data/messages.json");

const { normalizeMessages } = require("./utils/normalizador");

/**
 *
 */
const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

/**
 * Middleware
 */
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ encoded: true }));
app.use("/", productos);
app.use(express.static("public"));
app.use(
  session({
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://jesus:8dQg6XUWTuRWZV@cluster0.foboz.mongodb.net/sesiones?retryWrites=true&w=majority",
      MongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: "qwertyuiop",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 10, // 10 minutos
    },
  })
);

/**
 * Socket.io
 */
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

/**
 * Aplicación con autenticación
 */
app.get("/", (req, res) => {
  res.redirect("/tienda");
});

app.get("/tienda", auth, (req, res) => {
  res.render("index.ejs", { nombre: req.session.user });
});

app.get("/login", (req, res) => {
  if (req.session?.user) {
    res.redirect("/");
  } else {
    res.sendFile("./views/login.html", { root: __dirname });
  }
});

app.post("/login", (req, res) => {
  req.session.user = req.body.nombre;
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  const user = req.session?.user;
  if (user) {
    req.session.destroy((error) => {
      if (!error) {
        res.render("logout.ejs", {
          nombre: user,
        });
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
});

/**
 * Iniciar el servidor
 */
const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
  console.log(
    `Servidor Http con Websockets - escuchando en el puerto ${
      connectedServer.address().port
    }`
  );
});
connectedServer.on("error", (error) =>
  console.log(`Error en servidor ${error}`)
);
