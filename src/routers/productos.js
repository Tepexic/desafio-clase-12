const express = require("express");
const { Router } = express;
const Productos = require("./../models/productos");

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

module.exports = productosRouter;
