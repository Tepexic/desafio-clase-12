const express = require("express");
const compression = require("compression");

const { Router } = express;

const infoRouter = Router();

const logger = require("../utils/logs");

const info = {
  inputArgs: process.argv.slice(2),
  path: process.cwd(),
  os: process.platform,
  processId: process.pid,
  nodeVersion: process.version,
  folder: __dirname,
  rss: process.memoryUsage().rss,
  cpus: require("os").cpus().length,
};

infoRouter.get("/info", async (req, res) => {
  logger.info({ ruta: req.path, metodo: req.method });
  // console.log(info); // para test de carga
  // for (let i = 0; i < 100; i++) {
  //   console.log(i);
  // }
  res.json(info);
});

infoRouter.get("/infozip", compression(), async (req, res) => {
  logger.info({ ruta: req.path, metodo: req.method });
  res.json(info);
});

module.exports = infoRouter;
