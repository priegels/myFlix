//importing required modules
const express = require('express'),
morgan = require('morgan'),
uuid = require('uuid'),
bodyParser = require('body-parser');
const dotenv = require("dotenv");
const { isBuffer } = require('lodash');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

dotenv.config();

//importing models from models.js
const mongoose = require('mongoose'),
Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

//connecting database
//mongoose.connect('mongodb://localhost:27017/K-Flix', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

/*app.use functions express.static to serve "documentation.html" from the public folder
and invoke middleware function */

//activating body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// enabling CORS
const cors = require('cors');
let allowedOrigins = ['http://localhost:1234', 'http://localhost:8080', 'https://k-flix.netlify.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // if a specific origin isn't found on the list of allowed origins 
      let message = "The CORS policy for this application doesn't allow access from origin " + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

//calling passport and authorization
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//calling express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(morgan('common'));

/**
 * Welcome page
 * @method GET
 * @returns {string} - welcome message 
 */
app.get("/", (req, res) => {
  res.send("Welcome to K-Flix!");
});

/**
 * Get all users
 * @method GET
 * @param {string} endpoint - endpoint to fetch users "url/users" 
 * @requires authentication JWT
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Get a single user
 * @method GET
 * @param {string} endpoint - endpoint to fetch single user "url/users/:Username" 
 * @requires authentication JWT
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Get all movies
 * @method GET
 * @param {string} endpoint - endpoint to fetch movies "url/movies" 
 * @requires authentication JWT
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .populate('Director')
    .populate('Genre')
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Get single movie by title
 * @method GET
 * @param {string} endpoint - endpoint to fetch single movie "url/movies/:Title" 
 * @requires authentication JWT
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .populate('Director')
  .populate('Genre')
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * Get all directors
 * @method GET
 * @param {string} endpoint - endpoint to fetch directors "url/directors" 
 * @requires authentication JWT
 */
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.find()
  .then((directors) => {
    res.status(200).json(directors);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * Get director by name
 * @method GET
 * @param {string} endpoint - endpoint to fetch director by name "url/directors/:Name" 
 * @requires authentication JWT
 */
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.findOne({ Name: req.params.Name })
  .then((director) => {
    res.json(director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * Get all genres
 * @method GET
 * @param {string} endpoint - endpoint to fetch genres "url/genres" 
 * @requires authentication JWT
 */
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find()
  .then((genres) => {
    res.status(200).json(genres);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

/**
 * Get single genre by name
 * @method GET
 * @param {string} endpoint - endpoint to fetch single genre "url/genres/:Name" 
 * @requires authentication JWT
 */
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.findOne({ Name: req.params.Name })
  .then((genre) => {
    res.json(genre);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


//PUT Requests

/**
  * Update user by username
  * @method PUT
  * @param {string} endpoint - endpoint to add user. "url/users/:Usename"
  * @param {string} Username - required
  * @param {string} Password - user's new password
  * @param {string} Email - user's new e-mail adress
  * @param {string} Birthday - user's new birthday
  * @returns {string} - returns success/error message
  * @requires authentication JWT
  */
app.put('/users/:Username',
[
  check('Username', 'Username is required (containing at least 3 characters)').isLength({min: 3}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], passport.authenticate('jwt', { session: false }), (req, res) => {
  // check validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else if (req.user.Username !== req.params.Username) {
    res.status(403).send('Error: Cannot change other users\' info.');
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, {$set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//POST Requests

/**
 * Register user
 * @method POST
 * @param {string} endpoint - endpoint to add user. "url/users"
 * @param {string} Username - choosen by user
 * @param {string} Password - user's password
 * @param {string} Email - user's e-mail adress
 * @param {string} Birthday - user's birthday
 * @returns {object} - new user
 * @requires auth no authentication - public
 */
app.post('/users',
  [
    check('Username', 'Username is required (containing at least 3 characters)').isLength({min: 3}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
    // check validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(409).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user) })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    })
  }
})
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});


/**
 * Add movie to favorites
 * @method POST
 * @param {string} endpoint - endpoint to add movies to favorites "url/users/:Username/movies/:MovieID"
 * @param {string} Title, Username - both are required
 * @returns {string} - returns success/error message
 * @requires authentication JWT
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//DELETE Requests

/**
 * Delete movie from favorites
 * @method DELETE
 * @param {string} endpoint - endpoint to remove movies from favorites "url/users/:Username/movies/:MovieID"
 * @param {string} Title Username - both are required
 * @returns {string} - returns success/error message
 * @requires authentication JWT
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
  {new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

/**
 * Delete user profile
 * @method DELETE
 * @param {string} endpoint - endpoint to delete user data "url/users/:Username"
 * @param {string} Title Username - both are required
 * @returns {string} - returns success/error message
 * @requires authentication JWT
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
    /*
    if (!user) {
      res.status(400).send(req.params.Username + ' was not found');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }*/

    //preventing users from deleting any users but themselves
    if (req.user.Username !== req.params.Username) {
      res.status(403).send('Cannot delete other users.')
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


//error handling middleware

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
