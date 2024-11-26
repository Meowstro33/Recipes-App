// Loads the Express module, a web application framework for Node.js, used to handle HTTP requests and serve responses.
const express = require('express');
// Loads the cors module, which allows Cross-Origin Resource Sharing. This enables your server to accept requests from different origins (e.g., requests from http://localhost:3000).
const cors = require('cors');
// Loads environment variables from a .env file into process.env. This is useful for managing sensitive data (e.g., API keys, database credentials) without hardcoding them into the codebase.
require('dotenv').config();
// Loads Node.js's built-in path module, which provides utilities for working with file and directory paths. It's used here to resolve the path for serving static files.
const path = require('path');

// Creates an instance of the Express application. This app object is used to define routes and middleware.
const app = express();
// Configures CORS to only allow requests from http://localhost:3000. This is useful for security, ensuring only your frontend can access the backend.
const corsOptions = {
    origin: 'http://localhost:3000',
};

// Adds the CORS middleware to the app with the specified corsOptions. This allows the backend to handle requests from http://localhost:3000.
app.use(cors(corsOptions));
// Adds middleware to parse incoming JSON requests. This enables the server to access data sent in the request body using req.body.
app.use(express.json());

// Serves static files (e.g., HTML, CSS, JavaScript) from the public directory
// path.join(__dirname, 'public') resolves the absolute path to the public folder in the backend directory.
// express.static() makes all files in that folder accessible via the server.
app.use(express.static(path.join(__dirname, 'public')));

// Reads the PORT value from the .env file. If it isn't defined, it defaults to 5000.
const PORT = process.env.PORT || 5000;
// Starts the server on the specified PORT and logs a message when the server is running.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
