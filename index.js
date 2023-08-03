const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const authController = require('./controllers/authController');
const propertyController = require('./models/PropertyController');
const uploadController = require('./models/uploadController');

const app = express();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// mongodb connect
mongoose.set("strictQuery", false);

// Connect to MongoDB using Mongoose with the Promise-based approach
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB has been started successfully");
  app.use('/images',express.static('public/images'));
    
  app.use('*',cors({
    origin:"*",
    credentials:true
}))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/auth", authController);
    app.use("/property",propertyController);
    app.use("/upload",uploadController);

    app.listen(process.env.PORT, () =>
      console.log("Server has been started successfully")
    );
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    // You may choose to gracefully terminate the application here if the connection fails.
    // For simplicity, we'll just exit the application.
    process.exit(1);
  });
