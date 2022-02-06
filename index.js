const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const ObjectId = require("mongodb").ObjectId;

app.use(cors())
app.use(express.json())

const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jo0ws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
async function run() {


    try {
        await client.connect();
        const database = client.db("food-engine");
        const foodCollection = database.collection("food");
        const userOrderCollection = database.collection("userOrder")
        const confirmOrderCollection = database.collection("OrderConfirm")
        const finalOrderConfirmCollection = database.collection("Final-Order_confirm")

        //add foods
        app.post("/addFoods", async (req, res) => {
            // console.log(req.body)
            const result = await foodCollection.insertOne(req.body);
            // console.log(result);
            res.send(result)
        })

        //get all foods
        app.get('/addfoods', async (req, res) => {
            const result = await foodCollection.find({}).toArray();
            res.json(result)
        })

        // get clickable package
        app.get('/addfoods/:id', async (req, res) => {
            let id = req.params.id;
            const result = await foodCollection.find({ _id: ObjectId(id) }).toArray();
            res.send(result)
        })

        // post order item
        app.post('/orderItems', async (req, res) => {
            const result = await userOrderCollection.insertOne(req.body);
            res.send(result)
        });

        //get the order item from client page 
        app.get('/orderItems', async (req, res) => {
            const result = await userOrderCollection.find({}).toArray();
            res.json(result)
        })

        //delete items
        app.delete("/orderItems/:id", async (req, res) => {
            const id = req.params.id;

            const result = await userOrderCollection.deleteOne({ _id: req.params.id });
            res.send(result);
        });

        //add Client address and details
        app.post("/confirmOrder", async (req, res) => {
            // console.log(req.body)
            const result = await confirmOrderCollection.insertOne(req.body);
            // console.log(result);
            res.send(result)
        })

        //get Client address and details
        app.get('/confirmOrder', async (req, res) => {
            const result = await confirmOrderCollection.find({}).toArray();
            res.json(result)
        })


        //Final order confirmation post
        app.post("/finalConfirmation", async (req, res) => {
            console.log(req.body)
            const result = await finalOrderConfirmCollection.insertOne(req.body);
            res.send(result)
        })

        //get the final order data 
        app.get('/orderItems', async (req, res) => {
            const result = await confirmOrderCollection.find({}).toArray();
            res.json(result)
        })

        //update status 
        app.put('/orderItems/:id', async (req, res) => {
            const { id } = req.params;
            const result = await confirmOrderCollection.updateOne(
                { upsert: true },
                { $set: { status: "Approve" } }

            );
            res.send(result)
        });

        //delete admin side data 
        app.delete('/orderItems/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await confirmOrderCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        });



        console.log('database connected successfully');


    }


    finally {

        // await client.close();

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {


    res.send('Hello Food Engine!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})

