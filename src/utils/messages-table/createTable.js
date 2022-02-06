const { options } = require("../../../data/sqliteOptions");

const knex = require("knex")(options);

knex.schema
  .createTable("messages", (table) => {
    table.increments("id");
    table.string("account");
    table.string("timestamp");
    table.string("text");
  })
  .then(() => console.log("Table created"))
  .catch((error) => {
    console.error(error);
    throw error;
  })
  .finally(() => knex.destroy());
