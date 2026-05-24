// env-handling.ts
// Demonstrates environment variable handling in Bun

// Bun automatically loads .env files
// No need for dotenv in most cases!

// Access environment variables
const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL,
    apiKey: process.env.API_KEY
};

console.log('Configuration:', config);

// Validate required environment variables
const required = ['DATABASE_URL', 'API_KEY'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    process.exit(1);
}

// Bun also supports Bun.env as an alternative
if (typeof Bun !== 'undefined') {
    console.log('Using Bun.env:', Bun.env.NODE_ENV);
}
