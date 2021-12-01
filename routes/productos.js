const express = require("express");
const faker = require("faker");
const { Router } = express;

const Contenedor = require("./../utils/Contenedor");
const Productos = new Contenedor("./routes/data/productos.json");

const productosRouter = Router();

productosRouter.get("/", async (req, res) => {
  const productos = await Productos.getAll();
  res.render("pages/lista", {
    productos,
  });
});

productosRouter.post("/", async (req, res) => {
  const productoNuevo = req.body;
  await Productos.save(productoNuevo);
  res.redirect(301, "../");
});

productosRouter.get("/productos-test", (req, res) => {
  const productos = [
    ...new Array(10).fill(0).map((_, i) => {
      return {
        id: i,
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        thumbnail: faker.image.imageUrl(),
      };
    }),
  ];
  res.json(productos);
});

module.exports = productosRouter;
