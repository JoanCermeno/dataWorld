import fastify from "fastify";
import mysqlPlugin from "@fastify/mysql";
import Routes from "./routes/index.js";
import cors from "@fastify/cors";
import pino from "pino";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

// Configurar Pino
const pinoConfig = pino({
  transport: {
    target: "pino-pretty",
  },
});
// Crear la instancia principal de Fastify
const server = fastify({ logger: pinoConfig, logLevel: "info" });

// configurando fastify-swagger
await server.register(fastifySwagger, {
  routePrefix: "/documentation",
  swagger: {
    info: {
      swagger: "3.1.0",
      title: "API de Países, Estados y Ciudades",
      description: "Documentación para la API de países, estados y ciudades",
      version: "1.0.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "encuentra mas info ahi",
    },
    host: `${process.env.HOST}:${process.env.PORT}`,
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  exposeRoute: true,
});
await server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: {
    defaultSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  },
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});

// Registrar el plugin de MySQL en la instancia principal
server.register(mysqlPlugin, {
  connectionString: `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  promise: true, // Habilita el uso de promesas
});

// Registrar el plugin de CORS y configurar el dominio permitido
await server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"], // permite métodos HTTP específicos
  allowedHeaders: ["content-type", "authorization"],
});

// Función para obtener una conexión del pool de conexiones y ejecutar una consulta
export async function query(sql, params = []) {
  try {
    const connection = await server.mysql.getConnection();
    const [rows] = await connection.query(sql, params);
    //liberamos el pool de conexion
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error en la consulta:", error);
    throw error;
  }
}

// Registrar las rutas
Routes.forEach((route) => {
  server.route(route);
});

// Iniciar el servidor
const port = process.env.PORT || 3010;
const HOST = process.env.HOST;

server.listen({ port, host: HOST }, (err, address) => {
  if (err) {
    //determinando el tipo de error:
    switch (err.code) {
      case "ECONNREFUSED":
        //generalmente ocurre cuando las credenciales o el servicio de base de datos no responde a la solicitud de conexion
        console.error(
          "\x1b[31m%s\x1b[0m",
          "Fallo al conectar con el servicio de la base de datos"
        );
        break;
      default:
        console.log("Error desconocido:");
        break;
    }
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Server listening at ${address}`);
  }
});
