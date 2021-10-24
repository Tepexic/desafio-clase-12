// Consigna: Implementar programa que contenga una clase llamada Contenedor que reciba el nombre del archivo con el que va a trabajar

fs = require("fs");

class Contenedor {
  constructor(path) {
    this.filePath = path;
    this.encoding = "utf-8";
    this.fileContent = [];
  }

  // Lee el archivo, o crea uno si está vacío o no existe
  async readFile() {
    try {
      this.fileContent = JSON.parse(
        await fs.promises.readFile(this.filePath, this.encoding)
      );
    } catch {
      // el archivo no existe, hay que hacer uno nuevo
      await this.writeFile();
    }
  }

  // Escribe el archivo
  async writeFile(content = this.fileContent) {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(content));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * save(Object): Number - Recibe un objeto, lo guarda en el archivo,
   * devuelve el id asignado.
   */
  async save(element) {
    // leer el archivo
    await this.readFile();
    // el id nuevo es el ultimo id + 1
    const newId = this.fileContent.length
      ? this.fileContent[this.fileContent.length - 1].id + 1
      : 0;
    this.fileContent.push({ ...element, id: newId });
    // Guardar archivo con el nuevo elemento
    await this.writeFile();
    return newId;
  }

  /**
   * getById(Number): Object - Recibe un id y devuelve el objeto con ese id,
   * o null si no está.
   */
  async getById(id) {
    await this.readFile();
    const searchResult = this.fileContent.filter((e) => {
      return e.id === id;
    });
    return searchResult.length ? searchResult[0] : null;
  }

  /**
   * updateById(Number, Object): - Recibe un id y un objeto. Actualiza el objeto con ese id,
   * retorna true si el objeto con ese id existe, false en caso contrario
   */
  async updateById(id, newData) {
    await this.readFile();
    const index = this.fileContent.findIndex((e) => {
      return e.id === id;
    });
    if (index > -1) {
      // reemplazar elemento con los nuevos datos
      this.fileContent.splice(index, 1, { ...newData, id });
      this.writeFile();
      return true;
    } else {
      console.log("No se encontró el elemento en la base de datos");
      return false;
    }
  }

  /**
   * getAll(): Object[] - Devuelve un array con los objetos presentes en el
   * archivo.
   */
  async getAll() {
    await this.readFile();
    return this.fileContent;
  }

  /**
   * deleteById(Number): void - Elimina del archivo el objeto con el id
   * buscado.
   */
  async deleteById(id) {
    await this.readFile();
    const index = this.fileContent.findIndex((e) => {
      return e.id === id;
    });
    if (index > -1) {
      this.fileContent.splice(index, 1);
      this.writeFile();
      return true;
    } else {
      console.log("No se encontró el elemento en la base de datos");
      return false;
    }
  }

  /**
   * deleteAll(): void - Elimina todos los objetos presentes en el archivo.
   */
  async deleteAll() {
    await this.writeFile([]);
    console.log("Base de datos borrada.");
  }
}

module.exports = Contenedor;
