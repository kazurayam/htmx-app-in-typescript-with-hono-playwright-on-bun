// fastify-server.js
// Fastify application compatible with both Node.js and Bun

const fastify = require('fastify')({ logger: true });

// Register plugins
fastify.register(require('@fastify/cors'), {
    origin: true
});

// Define routes
fastify.get('/', async (request, reply) => {
    return {
        message: 'Fastify on Bun',
        runtime: typeof Bun !== 'undefined' ? 'Bun' : 'Node.js'
    };
});

fastify.get('/health', async (request, reply) => {
    return { status: 'healthy', uptime: process.uptime() };
});

fastify.post('/echo', async (request, reply) => {
    // Request body is automatically parsed
    return { echo: request.body };
});

// Define schema for validation
const userSchema = {
    body: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' }
        }
    }
};

fastify.post('/users', { schema: userSchema }, async (request, reply) => {
    const { name, email } = request.body;
    reply.code(201);
    return { id: Date.now(), name, email };
});

// Start server
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
