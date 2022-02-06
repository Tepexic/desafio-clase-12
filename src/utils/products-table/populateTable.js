const { options } = require("../../../data/sqliteOptions");
const knex = require("knex")(options);

const products = [
  {
    title: "Cinta de reparación de pantalla de 5x200CM",
    price: 4922,
    thumbnail:
      "https://ae01.alicdn.com/kf/H1b13e3760cc74dcd9b7e161256820bbdT/Cinta-de-reparaci-n-de-pantalla-de-5x200CM-parche-autoadhesivo-para-puerta-y-ventana-s-per.jpeg_Q90.jpeg_.webp",
  },
  {
    title:
      "Interruptor Outemu de 3 pines para teclado mecánico, interruptores táctiles y silenciosos, RGB LED SMD, color azul y marrón, Compatible con interruptor MX",
    price: 38866,
    thumbnail:
      "https://ae01.alicdn.com/kf/H9013370bd7e64d24983d6cea7fbb4724y/Interruptor-Outemu-de-3-pines-para-teclado-mec-nico-interruptores-t-ctiles-y-silenciosos-RGB-LED.jpg_640x640.jpg",
  },
  {
    title: "Cable de Teclado mecánico personalizado de 1,7 m",
    price: 4500,
    thumbnail:
      "https://ae01.alicdn.com/kf/H777100f369944bb7b003618ae4143030b/Teclado-mec-nico-personalizado-de-1-7-m-cable-usb-c-resorte-en-espiral-mini-interfaz.jpg_Q90.jpg_.webp",
  },
  {
    title: "Cuentas de plata",
    price: "3312",
    thumbnail:
      "https://ae01.alicdn.com/kf/H4a11282f49f049218e6f7a69e31290c2e/Bamoer-Cuentas-de-mu-eco-de-nieve-de-Plata-de-Ley-925-dijes-de-rbol-de.jpg_Q90.jpg_.webp",
  },
];

knex("products")
  .insert(products)
  .then(() => {
    console.log("Inserted!");
  })
  .catch((err) => {
    console.error(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
