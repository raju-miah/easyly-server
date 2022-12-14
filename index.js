const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        const productsCollection = client.db('easylyEcom').collection('products');

        const advertiseCollection = client.db('easylyEcom').collection('advertise');

        const usersCollection = client.db('easylyEcom').collection('users');

        const bookingsCollection = client.db('easylyEcom').collection('bookings');

        const reportsCollection = client.db('easylyEcom').collection('reports');


        // category

        app.get('/category', async (req, res) => {
            const query = {};
            const category = await categoryCollection.find(query).toArray();
            res.send(category);
        });



        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { brandName: id };
            const product = await productsCollection.find(query).toArray();
            res.send(product);
        });

        // For add product

        app.post('/addproducts', async (req, res) => {
            const products = req.body;
            // console.log('in body', products);
            const result = await productsCollection.insertOne(products);
            // console.log('in insert', result)
            res.send(result);
        })



        // advertise product

        app.get('/advertise', async (req, res) => {
            const query = {};
            const result = await advertiseCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/advertise', async (req, res) => {
            const add = req.body;
            const result = await advertiseCollection.insertOne(add);
            res.send(result);
        })

        app.delete('/advertise/:id', async (req, res) => {
            const id = req.params.id;
            const query = { id: id };
            const result = await advertiseCollection.deleteOne(query);
            res.send(result);
        });



        // for get product in my product

        app.get('/myproduct', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const myproduct = await productsCollection.find(query).toArray();
            res.send(myproduct);
        })

        // for delete product

        app.delete('/myproduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        });


        // booking 

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { buyerEmail: email };
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            // console.log(booking);
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })

        // report to admin

        app.get('/report', async (req, res) => {
            const query = {};
            const report = await reportsCollection.find(query).toArray();
            res.send(report);
        })

        app.post('/report', async (req, res) => {
            const report = req.body;
            const result = await reportsCollection.insertOne(report);
            res.send(result);
        })

        app.delete('/report/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reportsCollection.deleteOne(query);
            res.send(result);
        });


        // for users base route

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
            // res.send(user);
            // console.log(user);
        });


        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'buyer' });
        });


        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        })



        // all users

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })


        app.post('/users', async (req, res) => {
            const user = req.body
            // console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.put('/users', async (req, res) => {
            const user = req.body
            // console.log(user);
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'buyer'
                }
            }
            const result = await usersCollection.updateOne(user, updatedDoc, options);
            res.send(result);
        })


        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        });



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