const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const uri =
  "mongodb+srv://jesus:8dQg6XUWTuRWZV@cluster0.foboz.mongodb.net/users?retryWrites=true&w=majority";

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
