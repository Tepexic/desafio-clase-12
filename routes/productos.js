const express = require("express");
const faker = require("faker");
const { Router } = express;

const Contenedor = require("./../utils/Contenedor");
const Productos = new Contenedor("./routes/data/productos.json");

const auth = require("./../utils/auth");

const productosRouter = Router();

const logger = require("../utils/logs");

productosRouter.post("/", auth, async (req, res) => {
  logger.info({ ruta: req.path, metodo: req.method });
  try {
    const productoNuevo = req.body;
    await Productos.save(productoNuevo);
    res.redirect(301, "../");
  } catch (error) {
    logger.error({ ruta: req.path, metodo: req.method, error });
    res.status(500).send(error);
  }
});

productosRouter.get("/api/productos-test", (req, res) => {
  logger.info({ ruta: req.path, metodo: req.method });
  try {
    //throw new Error("Error de prueba");
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
  } catch (error) {
    logger.error({ ruta: req.path, metodo: req.method, error });
    res.status(500).send(error);
  }
});

module.exports = productosRouter;
