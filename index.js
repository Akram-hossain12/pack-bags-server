const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.rwn7rl0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const serviceCollection = client.db('packsdb').collection('services')
    const reviewesCollection = client.db('packsdb').collection('reviewes')


    app.get('/services', async (req, res) => {

      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 3;
      const skip = page * limit;

      const result = await serviceCollection.find().skip(skip).limit(limit).toArray();
      res.send(result);
    });
    app.get("/allServices",async(req,res)=>{
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    })
    app.get('/totalServices', async (req, res) => {
      const result = await serviceCollection.estimatedDocumentCount();
      res.send({ totalServices: result })
    })
    app.post('/reviewes',async(req,res)=>{
          
      const reviewes =req.body;
      const result = await reviewesCollection.insertOne(reviewes);

      res.send(result)
    })

    app.get("/reviewes",async(req,res)=>{
      const query={}
      const cursor = reviewesCollection.find(query)
      const reviewes =await cursor.toArray();
      res.send(reviewes)
    })


  }
  finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Pack-Bags server is running')
})

app.listen(port, () => {
  console.log(`pack-bags server running on ${port}`);
})