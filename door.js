const express = require("express");
const path = require("path");
const session = require("express-session");
const routes = require("./routes"); // Import the central router

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files middleware
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "defaultSecret", // Use environment variable for secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production" }, // Secure cookies in production
};

app.use(session(sessionOptions));

// Middleware to make session user available in templates
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Use the central router
app.use("/", routes);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
