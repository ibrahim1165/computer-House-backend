const express = require('express')

const app = express()

const cors = require('cors');

require('dotenv').config();

const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: 'unauthorized access' })
//   }
//   const token = authHeader.split(' ')[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {

//     if (err) {
//       return res.status(403).send({ message: 'Forbidden access' })
//     }
//     console.log('decoded', decoded)
//     req.decoded = decoded;
//     next()
//   })
// }
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cpt9rqt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db('computerHouse').collection('products');
    const orderCollection = client.db('computerHouse').collection('order');
    app.get('/product', async (req, res) => {
      const query = {};
      const curser = serviceCollection.find(query);
      const result = await curser.toArray()
      res.send(result);
    })
    
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id:new ObjectId(id)}
      const result = await serviceCollection.findOne(query);
      res.send(result)
    })

    app.post('/order',async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

  }
  finally {

  }
}
run().catch(console.dir)
app.get('/', (req, res) => {
  res.send('Hello form computer House!')
})
app.listen(port, () => {
  console.log(`ComputerHouse port ${port}`)
})