import fastify from 'fastify';
import { version } from '../package.json';
import userRoutes from './routes/userRoutes';

const swagger = require('@fastify/swagger');
const dotenv = require('dotenv');

dotenv.config();

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
});

const serverConfig = {
  host: process.env['SERVER_ADDRESS'] || '127.0.0.1',
  port: parseInt(process.env['PORT'] || '8080', 10),
};

server.register(require('@fastify/jwt'), {
  secret: process.env['JWT_SECRET'],
});

server.register(swagger, {
  openapi: {
    info: {
      title: 'YAPLOG API Documentation',
      version,
    },
    servers: [{
      url: `http://localhost:${process.env['PORT'] || 8080}`,
      description: 'Local API',
    }],
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
});

server.get('/health', async (_request, reply) => reply.send(200));

server.get('/docs/json', (_req, res) => {
  // @ts-ignore
  res.send(server.swagger());
});

server.register(userRoutes);

server.listen(serverConfig, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server ${version} is listening at ${address}`);
});

if (process.env['NODE_ENV'] === 'production') {
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => server.close().then((err) => {
      console.log(`close application on ${signal}`);
      process.exit(err ? 1 : 0);
    }));
  });
}

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});
