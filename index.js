const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;


const app = express();


// middle ware
app.use(cors());
app.use(express.json());


// setup basic

app.get('/', async (req, res) => {
    res.send('Easyly Server id Running');
})

app.listen(port, () => {
    console.log(`Easyly server running on ${port}`);
})