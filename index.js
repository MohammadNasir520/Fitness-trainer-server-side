const express = require('express');
const app= express();
const cors = require('cors');
const port=process.env.PORT || 5000;
require('dotenv').config()

// midle ware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c5dej4c.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){

    try{
        // add servicess
        const ServiceCollection=client.db('servicesDb').collection('services')
        app.post('/services', async(req, res)=>{
           
            const services =req.body;
            const result= await ServiceCollection.insertOne(services);
            res.send(result);
            
        })

        app.get('/services',async(req,res)=>{
            let query= {};
            const cursor=ServiceCollection.find(query).limit(3)
            const services= await cursor.toArray();
            res.send(services)
        })
        app.get('/allServices',async(req,res)=>{
            let query= {};
            const cursor=ServiceCollection.find(query)
            const services= await cursor.toArray();
            res.send(services)
        })

    }
    finally{

    }
}
run().catch(err=>console.log(err))



app.get('/',(req, res)=>{
    res.send('server api is running')
});


app.listen(port, ()=>{
    console.log(`server is running on ${port}`)
})