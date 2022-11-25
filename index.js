const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();


// middle ware
app.use(cors());
app.use(express.json());


// MongoDB


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ryrpoqq.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const categoryCollection = client.db('easylyEcom').collection('category');
        const usersCollection = client.db('easylyEcom').collection('users');

        app.get('/category', async (req, res) => {
            const query = {};
            const category = await categoryCollection.find(query).toArray();
            res.send(category);
        });



        // users

        app.post('/users', async (req, res) => {
            const user = req.body
            // console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })



    }
    finally {

    }
}

run().catch(error => console.error(error));





// setup basic

app.get('/', async (req, res) => {
    res.send('Easyly Server id Running');
})

app.listen(port, () => {
    console.log(`Easyly server running on ${port}`);
})