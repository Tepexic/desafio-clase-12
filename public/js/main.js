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
  console.log(data);
  const template = Handlebars.compile(messageLogSrc);
  const mensajes = { messages: data };
  document.getElementById("messages-placeholder").innerHTML =
    template(mensajes);
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
    account: account.value,
    timestamp,
    text: message.value,
  };
  socket.emit("new-message", mensaje);
  message.value = ""; // limpiar campo de mensaje
  return false;
}
