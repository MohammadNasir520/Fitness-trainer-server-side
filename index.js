const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

// midle ware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c5dej4c.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // collection
    const ServiceCollection = client.db("servicesDb").collection("services");

    const ReviwsCollection = client.db("servicesDb").collection("Reviews");

    // create servises by add services
    app.post("/services", async (req, res) => {
      const services = req.body;
      const result = await ServiceCollection.insertOne(services);
      res.send(result);
    });

    //servicess get method for home page
    app.get("/services", async (req, res) => {
      let query = {};
      const cursor = ServiceCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });

    // all services fr see all button
    app.get("/allServices", async (req, res) => {
      let query = {};
      const cursor = ServiceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // specificServiceDetails
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ServiceCollection.findOne(query);
      res.send(result);
    });

    // add reviews
    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      const result = await ReviwsCollection.insertOne(reviews);
      res.send(result);
    });

    // query all reviews by service id .
    app.get("/reviews", async (req, res) => {
      console.log(req.query);

      let query = {};

      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      if (req.query.serviceId) {
        query = {
          serviceId: req.query.serviceId,
        };
      }

      const cursor = ReviwsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

// delete review 
    app.delete('/reviews/:id',async(req, res)=>{
        const id = req.params.id;
        const query ={_id: ObjectId(id)}
        const result= await ReviwsCollection.deleteOne(query)
        res.send(result)
    })



//get review by id
    app.get('/reviews/:id',async(req, res)=>{
        const id = req.params.id;
        const query ={_id: ObjectId(id)}
        const result= await ReviwsCollection.findOne(query)
        res.send(result)
    })

    app.put('/reviews/:id',async(req, res)=>{
        const id = req.params.id;
        console.log(id)
        const review=req.body.review;
        const query ={_id: ObjectId(id)}
        const updateDoc={
            $set:{
                review: review
            }
        }
        const result= await ReviwsCollection.updateOne(query,updateDoc)
        res.send(result)
    })

   
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("server api is running");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
