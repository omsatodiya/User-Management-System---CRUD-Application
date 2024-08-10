//imports
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB

mongoose.connect(process.env.DB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB:', err));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

//for flashing msg

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
})

//setting template engine

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//public folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("", require("./routers/router"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
