const socket = io.connect();

// Obtener plantilla de handlebars
const tablaProductosSrc = document.getElementById("product-table").innerHTML;

// función para renderizar tabla de productos, pasando la lista a la plantilla compilada
// de handlebars
socket.on("productos", (data) => {
  console.log(data);
  var template = Handlebars.compile(tablaProductosSrc);
  const productos = { productos: data };
  document.getElementById("table-placeholder").innerHTML = template(productos);
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
