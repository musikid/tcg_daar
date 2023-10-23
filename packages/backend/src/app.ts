import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

const start = async (port: number = 3000) => {
    try {
        await fastify.listen({ port });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();