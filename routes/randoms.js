const express = require("express");
const { Router } = express;
const { fork } = require("child_process");

const randomsRouter = Router();

randomsRouter.get("/api/randoms", async (req, res) => {
  const number = req.query.cant ? req.query.cant : 100000000;
  const computo = fork("./utils/calcRandoms.js");
  computo.send(number);
  computo.on("message", (randoms) => {
    res.json(randoms);
  });
});

module.exports = randomsRouter;
