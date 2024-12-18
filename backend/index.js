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
// This is a Node.js function used to import modules, files, or libraries.
// Here, it imports whatever is exported from the ./database file in the same directory.
const pool = require('./database');

const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs for file names

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // Save files in an "uploads" directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName); // Append a unique ID to the file name
    },
});
const upload = multer({ storage });

// Adds the CORS middleware to the app with the specified corsOptions. This allows the backend to handle requests from http://localhost:3000.
app.use(cors(corsOptions));
// Adds middleware to parse incoming JSON requests. This enables the server to access data sent in the request body using req.body.
app.use(express.json());

// Serves static files (e.g., HTML, CSS, JavaScript) from the public directory
// path.join(__dirname, 'public') resolves the absolute path to the public folder in the backend directory.
// express.static() makes all files in that folder accessible via the server.
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Gets all recipes(thumbnail + name) in alphabetical order
app.get('/api/browseRecipes', async function(req, res) {
    try {
        const recipesResult = await pool.query('SELECT recipe_name, image_id FROM recipe_images WHERE thumbnail = true ORDER BY recipe_name ASC');
        const categoriesResult = await pool.query('SELECT category_name FROM main_categories ORDER BY category_name ASC');
        console.log("Categories:", categoriesResult.rows);
        
        res.json({
            recipes: recipesResult.rows,
            categories: categoriesResult.rows,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Get subcategories filtered by main category
app.get('/api/browseRecipes/Subcategory/:maincategoryName', async function (req, res) {
    try {
        const { maincategoryName } = req.params;

        // Query for subcategories of the main category
        const categoriesResult = await pool.query(
            'SELECT sub_category_name FROM sub_categories WHERE main_category = $1 ORDER BY order_number ASC',
            [maincategoryName]
        );

        // Query for all recipes, still sorted alphabetically
        const recipesResult = await pool.query(
            'SELECT recipe_name, image_id FROM recipe_images WHERE thumbnail = true ORDER BY recipe_name ASC'
        );

        res.json({
            recipes: recipesResult.rows,
            subcategories: categoriesResult.rows,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// Get recipes filtered by subcategory in alphabetical order
app.get('/api/browseRecipes/Subcategory/filterBySubcategory/:subcategoryName', async function (req, res) {
    try {
        const { maincategoryName, subcategoryName } = req.params; // Extract category and subcategory names from the request URL
        const result = await pool.query(
            `SELECT recipe_images.recipe_name, recipe_images.image_id
            FROM recipe_images
            JOIN recipe_main_tags ON recipe_images.recipe_name = recipe_main_tags.recipe_name
            JOIN recipe_sub_tags ON recipe_images.recipe_name = recipe_sub_tags.recipe_name
            WHERE recipe_images.thumbnail = true
            AND recipe_main_tags.tag_name = $1
            AND recipe_sub_tags.tag_name = $2
            ORDER BY recipe_images.recipe_name ASC`,
            [maincategoryName, subcategoryName] // Use parameterized queries for safety
        );

        if (result.rows.length === 0) {
            return res.status(404).send('No recipes found for this category and subcategory');
        }

        res.json(result.rows); // Respond with the filtered recipes
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// POST route to add a new recipe
app.post('/api/addRecipe', upload.fields([{ name: 'image' }, { name: 'video' }]), async (req, res) => {
    try {
        const {
            recipe_name,
            description,
            ingredients,
            tags,
            servings,
            steps,
            notes,
        } = req.body;
        // change imageFiles
        const imageFiles = req.files['image'] ? req.files['image'][0].filename : null;
        const videoFile = req.files['video'] ? req.files['video'][0].filename : null;

        // Insert into the recipes table
        await pool.query(
            `INSERT INTO recipes (recipe_name, description, video_id, servings) 
            VALUES ($1, $2, $3, $4)`,
            [recipe_name, description, videoFile, servings]
        );

        const ingredientsArray = JSON.parse(ingredients); // Ingredients sent as a JSON string array, this should be array of objects
            for (const ingredient of ingredientsArray) {
                await pool.query(
                    `INSERT INTO recipe_ingredients (ingredient_name, recipe_name, measurement_type, measurement_quantity, notes)
                    VALUES ($1, $2, $3, $4, $5)`,
                    [ingredient.ingredient_name, recipe_name, ingredient.measurement_type, ingredient.measurement_quantity, ingredient.notes]
                );
            }


        if (notes) {
            const notesArray = JSON.parse(notes); // Notes sent as a JSON string array
            for (const note of notesArray) {
                    await pool.query(
                        `INSERT INTO recipe_notes (recipe_name, description) 
                        VALUES ($1, $2)`,
                        [recipe_name, note]
                    );
                }
            }


        for (let i = 0; i < imageFiles.length; i++) {
            const isThumbnail = i === 0; // First image is the thumbnail
            await pool.query(
                `INSERT INTO recipe_images (recipe_name, image_id, thumbnail) VALUES ($1, $2, $3)`,
                [recipe_name, imageFiles[i], isThumbnail]
                );
            }

        // Insert tags into the recipe_main_tags table
        if (tags) {
            const tagsArray = JSON.parse(tags); // Tags sent as a JSON string array
            for (const tag of tagsArray) {
                await pool.query(
                    `INSERT INTO recipe_tags (recipe_name, tag_name) VALUES ($1, $2)`,
                    [recipe_name, tag]
                );
            }
        }



        res.status(201).send('Recipe added successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// Reads the PORT value from the .env file. If it isn't defined, it defaults to 5000.
const PORT = process.env.PORT || 5000;
// Starts the server on the specified PORT and logs a message when the server is running.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
