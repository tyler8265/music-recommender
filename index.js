require('dotenv').config();
const express = require('express');
const musicRoutes = require('./routes/music');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/music', musicRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server is running on PORT 3000...")
})
