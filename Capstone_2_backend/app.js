'use strict';

/** Express app for tripcards */

const express = require('express');
const cors = require('cors');


const { NotFoundError } = require('./ExpressError');

const { authenticateJWT } = require('./middleware/auth');
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const destinationsRoutes = require("./routes/destinations");
const categoriesRoutes = require("./routes/categories");
const businessesRoutes = require("./routes/businesses");
const tripcardsRoutes = require("./routes/tripcards");
const reviewsRoutes = require("./routes/reviews");
const followsRoutes = require("./routes/follows");
const apiRoutes = require("./routes/api");
const helpersRoutes = require("./routes/helpers");


const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(authenticateJWT);

app.use('/auth', authRoutes)
app.use('/users', usersRoutes);
app.use('/destinations', destinationsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/businesses', businessesRoutes);
app.use('/tripcards', tripcardsRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/follows', followsRoutes);
app.use('/api', apiRoutes);
app.use('/helpers', helpersRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== 'test') console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;