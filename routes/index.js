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
      tags: ["General"],
      response: {
        200: {
          description: "Respuesta exitosa",
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
      response: {
        200: {
          description: "Lista de países",
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
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
  },
  {
    method: "GET",
    url: "/ciudad",
    handler: ciudadesFrom,
  },
];
