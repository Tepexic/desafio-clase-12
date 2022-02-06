const { options } = require("../../../data/sqliteOptions");
const knex = require("knex")(options);

knex.schema
  .createTable("products", (table) => {
    table.increments("id");
    table.string("title");
    table.integer("price");
    table.string("thumbnail");
  })
  .then(() => {
    console.log("Table created!");
  })
  .catch((err) => {
    console.error(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
