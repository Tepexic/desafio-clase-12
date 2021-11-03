const options = {
  client: "sqlite3",
  connection: { filename: "./DB/messages-table/ecommerce.sqlite" },
  useNullAsDefault: true,
};

module.exports = { options };
