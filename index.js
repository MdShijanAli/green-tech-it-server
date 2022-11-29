const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');


const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


// 
// 




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jqheb6c.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


/* function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Unauthorized Access');
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })
} */




async function run() {
    try {
        const usersCollection = client.db('greenTechIt').collection('users')
        const categoriesCollection = client.db('greenTechIt').collection('categories')
        const productsCollection = client.db('greenTechIt').collection('products')
        const bookingsCollection = client.db('greenTechIt').collection('bookings')
        const blogsCollection = client.db('greenTechIt').collection('blogs')
        const advertiseCollection = client.db('greenTechIt').collection('advertise')


        // token 

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options);

            console.log(result)

            const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '7d'
            })
            console.log(token)
            res.send({ result, token })
        })



        // make Admin Api

        /*         app.put('/users/admin/:id', async (req, res) => {
                    const id = req.params.id;
                    const filter = { _id: ObjectId(id) };
                    const options = { upsert: true };
                    const updatedDoc = {
                        $set: {
                            role: 'admin'
                        }
                    }
                    const result = await usersCollection.updateOne(filter, updatedDoc, options);
                    res.send(result);
                }) */


        // get user

        /*   app.get('/users', async (req, res) => {
              const query = {};
              const users = await usersCollection.find(query).toArray();
              res.send(users)
          }) */




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
            const result = await advertiseCollection.find(query).limit(3).sort({ _id: -1 }).toArray();
            res.send(result);
        })


        // temorary update data

        /*  app.get('/update', async (req, res) => {
             const filter = {};
             const options = { upsert: true };
             const updatedDoc = {
                 $set: {
                     condition: 'Good',
                     parchesDate: '27 MAY, 2022',
                     description: 'HP Spectre x360 16 2-in-1 Laptop - 16t-f100 Windows 11 HomeIntel® Cor…'
                 }
             }
             const result = await productsCollection.updateMany(filter, updatedDoc, options);
             res.send(result);
         }) */


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