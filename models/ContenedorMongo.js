const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const uri = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.foboz.mongodb.net/${process.env.USERS_DB}?retryWrites=true&w=majority`;

const usersSchema = new Schema(
  {
    email: String,
    username: String,
    password: String,
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 1000,
    },
  }
);

class ContenedorMongo {
  constructor() {
    this.collection = mongoose.model("users", usersSchema);
    this.init();
  }

  async init() {
    if (this.connection) {
      return;
    }
    console.log("Conectando a la base de datos...");
    console.log(uri);
    this.connection = await mongoose.connect(uri);
  }
}

module.exports = ContenedorMongo;
