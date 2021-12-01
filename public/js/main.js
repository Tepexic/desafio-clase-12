// normalizacion
const authorSchema = new normalizr.schema.Entity("author");
const messageSchema = new normalizr.schema.Entity("message", {
  author: authorSchema,
});
const messagesSchema = new normalizr.schema.Entity("messages", {
  messages: [messageSchema],
});
const normalizeMessages = (messages) => {
  const normalizedData = normalizr.normalize(messages, messagesSchema);
  return normalizedData;
};
const denormalizeMessages = (normalizedData) => {
  const denormalizedData = normalizr.denormalize(
    "messages",
    messagesSchema,
    normalizedData.entities
  );
  return denormalizedData;
};

// global variable to store authors' data
let authors = {};

// Socket
const socket = io.connect();

// Obtener plantilla de handlebars
const tablaProductosSrc = document.getElementById("product-table").innerHTML;
const messageLogSrc = document.getElementById("message-log").innerHTML;

// función para renderizar tabla de productos, pasando la lista a la plantilla compilada
// de handlebars
socket.on("productos", (data) => {
  console.log(data);
  const template = Handlebars.compile(tablaProductosSrc);
  const productos = { productos: data };
  document.getElementById("table-placeholder").innerHTML = template(productos);
});

// función para renderizar tabla de mensajes
socket.on("messages", (data) => {
  console.log("---- MENSAJES NORMALIZADOS ----");
  console.log(data);
  // deep copy authors
  if (data.normalizedData) {
    authors = JSON.parse(JSON.stringify(data.normalizedData.entities.author));

    console.log("---- MENSAJES DESNORMALIZADOS ----");
    const denormalizedData = denormalizeMessages(data.normalizedData);
    console.log(denormalizedData);
    const template = Handlebars.compile(messageLogSrc);
    const mensajes = {
      messages: denormalizedData.messages,
      compression: data.compressionRate,
    };
    document.getElementById("messages-placeholder").innerHTML =
      template(mensajes);
  }
});

// función para mandar la información del formulario como mensaje
function addProduct() {
  const title = document.getElementById("title");
  const price = document.getElementById("price");
  const thumbnail = document.getElementById("thumbnail");
  const producto = {
    title: title.value,
    price: price.value,
    thumbnail: thumbnail.value,
  };
  socket.emit("new-product", producto);
  // Limpiar formulario
  title.value = "";
  price.value = "";
  thumbnail.value = "";
  return false;
}

// Función para mandar mensajes al servidor
function addMessage() {
  const account = document.getElementById("account");
  const timestamp = new Date().toLocaleString();
  const message = document.getElementById("message");
  const mensaje = {
    author: authors[account.value],
    text: message.value,
    timestamp,
  };
  socket.emit("new-message", mensaje);
  message.value = ""; // limpiar campo de mensaje
  return false;
}
