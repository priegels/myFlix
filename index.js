//importing required modules
const express = require('express'),
morgan = require('morgan'),
uuid = require('uuid'),
bodyParser = require('body-parser');

//importing models from models.js
const mongoose = require('mongoose'),
Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

//connecting database 
mongoose.connect('mongodb://localhost:27017/K-Flix', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

/*app.use functions express.static to serve "documentation.html" from the public folder
and invoke middleware function */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(morgan('common'));

//GET requests

//Get all users
app.get('/users', (req, res) => {
  Users.find() 
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get movie by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Get all directors
app.get('/directors', (req, res) => {
  Directors.find()
  .then((directors) => {
    res.status(201).json(directors);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Get director by name
app.get('/directors/:Name', (req, res) => {
  Directors.findOne({ Name: req.params.Name })
  .then((director) => {
    res.json(director);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Get all genres
app.get('/genres', (req, res) => {
  Genres.find()
  .then((genres) => {
    res.status(201).json(genres);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Get Genre by name
app.get('/genres/:Name', (req, res) => {
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

//app.put('/users/:name/:id/:username', (req, res) => {
  //No idea what to put here

//POST Requests

//Add a user

app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

//Add a movie to the users' list of favorites

app.post('/movies', (req, res) => {
  let newMovie = req.body;

  if (!newMovie.title) {
    const message = 'Missing title in request body';
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    topMovies.push(newMovie);
    res.status(201).send(newMovie);
  }
});

//DELETE Requests

// Delete a movie from the users' list of favorites
app.delete('/movies/:title', (req, res) => {
  let movie = topMovies.find((movie) => {
  return movie.title === req.params.title
  });

  if (movie) {
    topMovies = topMovies.filter((obj) => { return obj.title !== req.params.title });
    res.status(201).send('Movie with the title of ' + req.params.title + ' was deleted.');
  } else {
    res.status(404).send('Movie with the title $(req.params.title) was not found.');
  }
});

//delete a user from the user list (deregistering)
app.delete('/users/:id', (req, res) => {
  let user = users.find((user) => {
    return user.id === req.params.id
  });

  if (user) {
    users = users.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('User with the ID of ' + req.params.id + ' was deleted.');
  } else {
    res.status(404).send('User with the ID $(req.params.id) was not found.');
  }
});

//error handling middleware

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
