const express = require("express");
const compression = require("compression");

const { Router } = express;

const infoRouter = Router();

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
  res.json(info);
});

infoRouter.get("/infozip", compression(), async (req, res) => {
  res.json(info);
});

module.exports = infoRouter;
