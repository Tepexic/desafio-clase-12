const express = require("express");
const { Router } = express;
const { fork } = require("child_process");

const randomsRouter = Router();
const logger = require("../utils/logs");

randomsRouter.get("/api/randoms", async (req, res) => {
  logger.info({ ruta: req.path, metodo: req.method });
  const number = req.query.cant ? req.query.cant : 100000000;
  // desactivando child process para test de carga
  // const computo = fork("./utils/calcRandoms.js");
  // computo.send(number);
  // computo.on("message", (randoms) => {
  //   res.json(randoms);
  // });
  const randoms = {};
  for (let i = 0; i < number; i++) {
    const random = Math.random();
    if (randoms[random]) {
      randoms[random]++;
    } else {
      randoms[random] = 1;
    }
  }
  res.json(randoms);
});

module.exports = randomsRouter;
