const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.faeigco.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // // console.log("database connect");
    const userCollection = client.db("bookBuffet").collection("user");
    const allBooksCollection = client.db("bookBuffet").collection("allBooks");
    const allBookingBookCollection = client
      .db("bookBuffet")
      .collection("bookingsBook");
    const allBuyBooksCollection = client
      .db("bookBuffet")
      .collection("buyBooks");

    // // post User
    //create and update a user
    app.put("/create-user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;

      const filter = { email: email };
      const options = { upsert: true };

      const updatedDoc = {
        $set: user,
      };

      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );

      res.send(result);
    });

    // get all user
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const newCollection = await cursor.toArray();
      res.send(newCollection);
    });
    //get a single user from users

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const cursor = userCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    // post All Books
    app.post("/books", async (req, res) => {
      const newBooks = req.body;
      const result = await allBooksCollection.insertOne(newBooks);
      res.send(result);
    });
    // get all Books
    app.get("/books", async (req, res) => {
      const query = {};
      const cursor = allBooksCollection.find(query);
      const newCollection = await cursor.toArray();
      res.send(newCollection);
    });

    // all Book filter by  category
    app.get("/books/:booksCategory", async (req, res) => {
      const booksCategory = req.params.booksCategory;
      const query = { booksCategory };
      const cursor = allBooksCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    // get books by id
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await allBooksCollection.findOne(query);
      res.send(products);
    });
    // post bookings Books
    app.post("/bookingsBook", async (req, res) => {
      const newBooks = req.body;
      const result = await allBookingBookCollection.insertOne(newBooks);
      res.send(result);
    });
    // get bookings Books
    app.get("/bookingsBook", async (req, res) => {
      const query = {};
      const cursor = allBookingBookCollection.find(query);
      const newCollection = await cursor.toArray();
      res.send(newCollection);
    });

    // post buy Books
    app.post("/buyBooks", async (req, res) => {
      const newBooks = req.body;
      const result = await allBuyBooksCollection.insertOne(newBooks);
      res.send(result);
    });

    // get buy Books
    app.get("/buyBooks", async (req, res) => {
      const query = {};
      const cursor = allBuyBooksCollection.find(query);
      const newCollection = await cursor.toArray();
      res.send(newCollection);
    });

    // Delete one bok
    app.delete("/books/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allBooksCollection.deleteOne(query);
      res.send(result);
    });
    // Delete one booking book
    app.delete("/bookingsBook/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allBookingBookCollection.deleteOne(query);
      res.send(result);
    });
    // Delete one buy book
    app.delete("/buyBooks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allBuyBooksCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Book Buffet ");
});

app.listen(port, () => {
  console.log("Book Buffet is running Our Server");
});
