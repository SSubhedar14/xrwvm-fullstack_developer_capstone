const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json()); // Use this instead of express.raw for JSON body parsing

// Load data from JSON files
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// Connect to MongoDB
mongoose.connect("mongodb://mongo_db:27017/", { dbName: 'dealershipsDB' });

const Reviews = require('./review');
const Dealerships = require('./dealership');

// Initialize the database with data from JSON files
const initDatabase = async () => {
  try {
    await Reviews.deleteMany({});
    await Reviews.insertMany(reviews_data['reviews']);
    
    await Dealerships.deleteMany({});
    await Dealerships.insertMany(dealerships_data['dealerships']);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDatabase(); // Call the initialization function

// Express route to home
app.get('/', (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find({}); // Change from dealers to Dealerships
    res.json(dealers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const dealers = await Dealerships.find({ state: req.params.state }); // Change from dealers to Dealerships
    res.json(dealers);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealer = await Dealerships.findById(req.params.id); // Change from dealer to Dealerships
    if (!dealer) {
      return res.status(404).send('Dealer not found');
    }
    res.json(dealer);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Express route to insert review
app.post('/insert_review', async (req, res) => {
  const data = req.body; // No need to parse again

  const documents = await Reviews.find().sort({ id: -1 });
  const new_id = documents.length ? documents[0]['id'] + 1 : 1; // Check if documents array is empty

  const review = new Reviews({
    id: new_id,
    name: data['name'],
    dealership: data['dealership'],
    review: data['review'],
    purchase: data['purchase'],
    purchase_date: data['purchase_date'],
    car_make: data['car_make'],
    car_model: data['car_model'],
    car_year: data['car_year'],
  });

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.error('Error inserting review:', error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
