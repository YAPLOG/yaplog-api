import fastify from 'fastify';

const server = fastify({
  logger: true,
});

server.get('/health', async (_request, reply) => reply.send(200));

const serverConfig = {
  port: parseInt(process.env['PORT'] || '8080', 10),
};

if (process.env['NODE_ENV'] === 'production') {
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => server.close().then((err) => {
      console.log(`close application on ${signal}`);
      process.exit(err ? 1 : 0);
    }));
  });
}

server.listen(serverConfig, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(1);
});
