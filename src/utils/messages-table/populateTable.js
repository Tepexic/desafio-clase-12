const { options } = require("../../../data/sqliteOptions");
const knex = require("knex")(options);

const messages = [
  {
    account: "juan@tienda.com",
    timestamp: "10/24/2021, 3:03:04 PM",
    text: "¡Hola! ¿Que tal?",
  },
  {
    account: "pedro@tienda.com",
    timestamp: "10/24/2021, 3:04:04 PM",
    text: "Muy bien! Y tu?",
  },
  {
    account: "ana@tienda2.com",
    timestamp: "10/24/2021, 3:05:04 PM",
    text: "alguien tiene el precio del aguacate?",
  },
];

knex("messages")
  .insert(messages)
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
