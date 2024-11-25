const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
