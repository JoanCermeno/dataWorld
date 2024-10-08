import {
  welcome,
  pais,
  estadosFrom,
  ciudadesFrom,
} from "./../controllers/index.js";
export default [
  {
    method: "GET",
    url: "/",
    handler: welcome,
    schema: {
      description: "Ruta de bienvenida",
      tags: ["Welcome"],
      response: {
        200: {
          description:
            "Te muestra un HOLA MUNDO que indica que las rutas estan funcionando",
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
  },
  {
    method: "GET",
    url: "/pais",
    handler: pais,
    schema: {
      description: "Obtener la lista de países",
      tags: ["Países"],
      querystring: {
        type: "object",
        properties: {
          id_pais: {
            type: "integer",
            description: "ID del país para filtrar por ese país específico",
            nullable: true, // si el parámetro es opcional
          },
        },
        required: [], // Aquí se deja vacío si 'id_pais' no es requerido
      },
      response: {
        200: {
          description:
            "esto devolvera un json con todos los paises del mundo o si buscara un solo pais por el parametro id_pais",
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              code: { type: "string" },
            },
          },
        },
      },
    },
  },
  {
    method: "GET",
    url: "/estado",
    handler: estadosFrom,
    schema: {
      description:
        "Retorna los estados de un pais, tomando como parametro el id_pais",
      tags: ["Estados"],
      response: {
        200: {
          description: "Estados del pais id_pais",
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              code: { type: "string" },
            },
          },
        },
      },
    },
  },
  {
    method: "GET",
    url: "/ciudad",
    handler: ciudadesFrom,
    schema: {
      description:
        "retorna una lista de ciudades y pueblos de un estado, id_estado",
      tags: ["Ciudad"],
      response: {
        200: {
          description: "Ciudades del pais id_pais",
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              code: { type: "string" },
              id_pais: { type: "integer" },
              id_estado: { type: "integer" },
              latitude: { type: "number", format: "decimal" },
              longitude: { type: "number", format: "decimal" },
            },
          },
        },
      },
    },
  },
];
