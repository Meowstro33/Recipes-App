// The pg module is PostgreSQL's client library for Node.js. It allows your backend to interact with a PostgreSQL database.
// { Pool } is a class provided by pg that manages a pool of database connections.
// A connection pool is a cache of database connections that can be reused, improving performance by avoiding the overhead of creating and closing connections repeatedly.
const { Pool } = require('pg');
// This creates an instance of a connection pool, configured with database connection parameters.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// This exports the pool instance so it can be reused in other parts of the backend application.
module.exports = pool;
