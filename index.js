
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${ process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jy11d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("niche_products");
        const productsCollection= database.collection("products");
        const usersCollection =database.collection("users");
        const ordersCollection= database.collection("orders");


        // get api  
        app.get('/products',async(req,res)=>{
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })


        //  get single product api 
    app.get('/products/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id:ObjectId(id) };
        const product = await productsCollection.findOne(query);
        res.json(product);

    });


    //post order api 
  app.post("/orders", async (req, res) => {
    const result = await ordersCollection.insertOne(req.body);
    res.send(result);
  });

  ///get  all orders
  app.get("/orders", async (req, res) => {
    const result = await ordersCollection.find({}).toArray();
    res.send(result);
  });

     //Get single user orders
     app.get('/myOrders/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const order = await ordersCollection.find(query).toArray();
        res.send(order)
    });

   //Delete Order
   app.delete('/deleteOrder/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) }
    const order = await ordersCollection.deleteOne(query);
    res.json(order);
})
    

        // post api 
    app.post('/products',async(req,res)=>{
        const product = req.body;
        const result =await productsCollection.insertOne(product);
        res.json(result)
    });

// check admin or not 
    app.get('/users/:email',async(req,res)=>{
        const email = req.params.email;
        const query = {email:email};
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if(user?.role === 'admin'){
            isAdmin = true;
        }
        res.json({admin: isAdmin})

    })
    // users api 
    app.post('/users',async(req,res)=>{
        const user = req.body;
        const result =await usersCollection.insertOne(user);
        res.json(result)

    })
    app.put('/users',async(req,res)=>{
        const user =req.body;
        const filter ={email: user.email};
        const options = { upsert: true };
        const updateDoc = {$set:user};
        const result =await usersCollection.updateOne(filter,updateDoc,options);
        
        res.json(result)
    });
        // make admin 
    app.put('/users/admin', async(req,res)=>{
        const user = req.body;
        console.log('put',user)
        const filter = {email: user.email};
        const updateDoc = { $set: { role: 'admin'}};
        const result = await usersCollection.updateOne(filter,updateDoc);
        console.log(result);
        res.json(result)
    })

}
    finally{
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Niche Products Server is running!')
})

app.listen(port, () => {
  console.log('listening at',port)
})




