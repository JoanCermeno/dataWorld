import { query } from "../server.js";

export function welcome(req, reply) {
  reply.send({ message: "HOLA MUNDO!!" });
}

export async function pais(req, reply) {
  try {
    // Usa el módulo de conexión para ejecutar la consulta
    const countries = await query("SELECT * FROM countries");
    reply.send(countries);
  } catch (error) {
    reply.code(500).send({ error: "Error en la consulta" });
  }
}

export async function estadosFrom(req, reply) {
  try {
    // Accede al parámetro de consulta id_pais
    const { id_pais } = req.query;

    // Verifica que id_pais esté presente
    if (!id_pais) {
      return reply
        .code(400)
        .send({ error: "Parámetro nombrePais es requerido" });
    }

    // Usa el módulo de conexión para ejecutar la consulta usando id_pais
    const queryString = "SELECT * FROM regions WHERE country_id = ?";
    const estados = await query(queryString, [id_pais]);
    return estados;
  } catch (err) {
    console.error("Error al obtener estados:", err);
    reply.code(500).send({ error: "Error en la consulta" });
  }
}

export async function ciudadesFrom(req, reply) {
  try {
    // Accede al parámetro de consulta id_pais
    const { estado_id, pais_id } = req.query;

    // Verifica que id_pais esté presente
    if (estado_id == "undefined" || pais_id == "undefined") {
      return reply
        .code(400)
        .send({ error: "Parámetro estado_id y pais_id es requerido" });
    }

    // Usa el módulo de conexión para ejecutar la consulta usando id_pais
    const queryString =
      "SELECT * FROM cities WHERE country_id= ? AND region_id = ?";
    const ciudades = await query(queryString, [pais_id, estado_id]);
    return ciudades;
  } catch (err) {
    console.error("Error al obtener ciudades:", err);
    reply.code(500).send({ error: "Error en la consulta" });
  }
}
