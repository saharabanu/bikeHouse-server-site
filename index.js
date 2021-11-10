
const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${ process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jy11d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("niche_products");
        const productsCollection= database.collection("products");


        // get api  
        app.get('/products',async(req,res)=>{
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            console.log(products);
            res.send(products)
        })
    

        // post api 
    app.post('/products',async(req,res)=>{
        const product = req.body;
        // console.log('hit the post api',product)
       
        const result =await productsCollection.insertOne(product);
        console.log(result)
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





// https://elementorpress.com/templatekit-pro/layout08/#
// https://elementorpress.com/templatekit-pro/layout08/home-02/