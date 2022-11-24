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


// greenTechDB
// 9souNskkVTiLv1L8




const uri = "mongodb+srv://greenTechDB:9souNskkVTiLv1L8@cluster0.jqheb6c.mongodb.net/?retryWrites=true&w=majority";
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
                expiresIn: '1d'
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


        console.log('database connected')
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