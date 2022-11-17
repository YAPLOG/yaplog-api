import fastify from 'fastify';

const server = fastify();

server.get('/health', async (_request, reply) => reply.send(200));

const serverConfig = {
  port: parseInt(process.env['PORT'] || '8080', 10),
};

server.listen(serverConfig, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
