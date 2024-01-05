const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();




// middleware
app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jqheb6c.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const usersCollection = client.db('greenTechIt').collection('users')
        const categoriesCollection = client.db('greenTechIt').collection('categories')
        const productsCollection = client.db('greenTechIt').collection('products')
        const bookingsCollection = client.db('greenTechIt').collection('bookings')
        const blogsCollection = client.db('greenTechIt').collection('blogs')
        const advertiseCollection = client.db('greenTechIt').collection('advertise')





        // user post


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })


        // get users

        app.get('/users', async (req, res) => {
            const query = {}
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })


        // User Post api for google signin

app.post('/api/users', async (req, res) => {
    const email = req.body.email;
    const query = { email: email };

    try {
        const existingUser = await usersCollection.findOne(query);

        if (existingUser) {
            // User already exists, respond with an appropriate message
            res.send({ message: 'User with this email already exists' });
        } else {
            // User doesn't exist, create a new user
            const result = await usersCollection.insertOne({
                ...req.body
            });
            res.send(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


        // delete single users

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        })


        // get categories

        app.get('/categories', async (req, res) => {
            const query = {}
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        })


        // get all products

        app.get('/products', async (req, res) => {
            const query = {}
            const result = await productsCollection.find(query).toArray();
            res.send(result)
        })


        // get specific products

        app.get('/products/:category', async (req, res) => {
            const category = req.params.category;
            const query = { category: category }
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        })


        // single product

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        })


        // booking post 

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })

        // get bookings
        app.get('/bookings', async (req, res) => {
            const query = {}
            const result = await bookingsCollection.find(query).toArray();
            res.send(result);
        })

        // post product

        app.post('/add-a-product', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        })


        // get my products api

        app.get('/my-products/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email }
            const result = await productsCollection.find(filter).sort({ _id: -1 }).toArray();
            res.send(result)
        })


        // delete product api

        app.delete('/my-products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(filter);
            res.send(result);
        })


        // get my order api

        app.get('/my-orders/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email }
            const result = await bookingsCollection.find(filter).sort({ _id: -1 }).toArray();
            res.send(result)
        })


        // get blogs

        app.get('/blogs', async (req, res) => {
            const query = {}
            const result = await blogsCollection.find(query).toArray();
            res.send(result);
        })

        // single blogs

        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await blogsCollection.findOne(filter);
            res.send(result);
        })


        // get blogs section

        app.get('/home-blogs', async (req, res) => {
            const query = {}
            const result = await blogsCollection.find(query).limit(3).toArray();
            res.send(result);
        })


        // advertise post 

        app.post('/advertise', async (req, res) => {
            const advertise = req.body;
            const result = await advertiseCollection.insertOne(advertise);
            res.send(result);
        })


        // get advertise post

        app.get('/advertise', async (req, res) => {
            const query = {}
            const result = await advertiseCollection.find(query).sort({ _id: -1 }).toArray();
            res.send(result);
        })





        // saller update

        app.get('/update-user-role', async (req, res) => {
            const check = req.params.check;
            const filter = { check: true };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'saller'
                }
            }
            const result = await usersCollection.updateMany(filter, updatedDoc, options);
            res.send(result);
        })


        // buyer update

        app.get('/update-user-role-buyer', async (req, res) => {
            const check = req.params.check;
            const filter = { check: false };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'buyer'
                }
            }
            const result = await usersCollection.updateMany(filter, updatedDoc, options);
            res.send(result);
        })


        // payment methoed








    }
    finally {

    }
}
run()
    .catch(error => {
        console.log(error)
    })


app.get('/', (req, res) => {
    res.send('GREEN Tech It server is Running')
})


app.listen(port, () => console.log(`GREEN TECH IT running on: ${port}`))