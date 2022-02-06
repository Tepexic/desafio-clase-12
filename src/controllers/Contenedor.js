/**
 * Consigna:
 * desarrollar un nuevo contenedor con idénticos métodos pero que funcione sobre bases de datos,
 * utilizando Knex para la conexión. Esta clase debe recibir en su constructor el objeto de
 * configuración de Knex y el nombre de la tabla sobre la cual trabajará.
 */

const knex = require("knex");

class Contenedor {
  constructor(options, table) {
    this.options = options;
    this.table = table;
  }

  /**
   * save(Object): Number - Recibe un objeto, lo guarda, devuelve el id asignado.
   */
  async save(element) {
    const dbDriver = knex(this.options);
    try {
      return await dbDriver(this.table).insert(element);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      dbDriver.destroy();
    }
  }

  /**
   * getById(Number): Object - Recibe un id y devuelve el objeto con ese id
   */
  async getById(id) {
    const dbDriver = knex(this.options);
    try {
      const rows = await dbDriver.from(this.table).select("*").where("id", id);
      return rows.map((row) => {
        return { ...row };
      });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      dbDriver.destroy();
    }
  }

  /**
   * updateById(Number, Object): - Recibe un id y un objeto. Actualiza el objeto con ese id,
   * retorna true si el objeto con ese id existe, false en caso contrario
   */
  async updateById(id, newData) {
    const dbDriver = knex(this.options);
    try {
      const res = await dbDriver
        .from(this.table)
        .where("id", id)
        .update({ ...newData });
      return res > 0 ? true : false;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      dbDriver.destroy();
    }
  }

  /**
   * getAll(): Object[] - Devuelve un array con los objetos presentes en el
   * archivo.
   */
  async getAll() {
    const dbDriver = knex(this.options);
    try {
      const rows = await dbDriver.from(this.table).select("*");
      return rows.map((row) => {
        return { ...row };
      });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      dbDriver.destroy();
    }
  }

  /**
   * deleteById(Number): void - Elimina del archivo el objeto con el id
   * buscado.
   */
  async deleteById(id) {
    const dbDriver = knex(this.options);
    try {
      const res = await dbDriver.from(this.table).where("id", id).del();
      return res > 0 ? true : false;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      dbDriver.destroy();
    }
  }

  /**
   * deleteAll(): void - Elimina todos los objetos presentes en el archivo.
   */
  async deleteAll() {
    const dbDriver = knex(this.options);
    try {
      const res = await dbDriver.from(this.table).del();
      return res > 0 ? true : false;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      dbDriver.destroy();
    }
  }
}

module.exports = Contenedor;
