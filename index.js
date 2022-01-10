require("dotenv").config();

const cluster = require("cluster");
const numCpus = require("os").cpus().length;

const express = require("express");
const productos = require("./routes/productos");
const authRouter = require("./routes/authRouter");
const infoRouter = require("./routes/info");
const randomsRouter = require("./routes/randoms");
const { Server: SocketServer } = require("socket.io");
const { Server: HttpServer } = require("http");

const parseArgs = require("minimist");

const session = require("express-session");
const auth = require("./utils/auth");
const passport = require("passport");

/**
 * Contenedores
 */
const Contenedor = require("./utils/Contenedor");
const Productos = new Contenedor("./routes/data/productos.json");
const Mensajes = new Contenedor("./model/data/messages.json");

const { normalizeMessages } = require("./utils/normalizador");
const MongoStore = require("connect-mongo");

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
app.use(express.urlencoded({ encoded: false }));
app.use(express.static("public"));
app.use(
  session({
    store: new MongoStore({
      mongoUrl: `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.foboz.mongodb.net/${process.env.SESSION_DB}?retryWrites=true&w=majority`,
      MongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: "qwertyuiop",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", productos);
app.use("/", authRouter);
app.use("/", infoRouter);
app.use("/", randomsRouter);

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
  res.render("index.ejs", { nombre: req.user?.username });
});

/**
 * Iniciar el servidor
 */
options = {
  default: {
    port: 8080,
    mode: "fork",
  },
  alias: {
    p: "port",
    m: "mode",
  },
};
const argv = parseArgs(process.argv.slice(2), options);

const isCluster = argv.mode === "cluster";

if (isCluster && cluster.isMaster) {
  console.log("Master proceso iniciado");
  console.log(`Cantidad de procesadores: ${numCpus}`);
  console.log(`PID MASTER ${process.pid}`);

  for (let i = 0; i < numCpus; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`El worker ${worker.process.pid} ha finalizado`);
  });
} else {
  console.log(`Proceso ${process.pid} iniciado`);
  const connectedServer = httpServer.listen(argv.port, () => {
    console.log(`Servidor corriendo en http://localhost:${argv.port}`);
  });
  connectedServer.on("error", (error) =>
    console.log(`Error en servidor ${error}`)
  );
}
