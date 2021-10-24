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
  const producto = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
  };
  socket.emit("new-product", producto);
  return false;
}
