const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.eklps.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
const pass = 'anondo123456789'
app.use(cors());
app.use(bodyParser.json())
const port = 5055

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("fruitsdb").collection("product");
    const ordersCollection = client.db("fruitsdb").collection("orders");

    console.log('Database connected')
    app.get('/', (req, res) => {
        res.send('This is home page')
    })


    app.get('/allProducts', (req, res) => {
        productCollection.find()
        .toArray((err, pd) => {
            res.send(pd)
        })
    })

    app.get('/orders', (req, res) => {
        ordersCollection.find()
        .toArray((err, pd) => {
            res.send(pd)
        })
    })
    


    app.post('/addProducts', (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
        .then(result => {
            console.log('inserted-count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/orders', (req, res) => {
        const newOrder = req.body;
        ordersCollection.insertOne(newOrder)
        .then(result => {
            console.log('inserted-Count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })
});


app.listen(port)