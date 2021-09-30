const express = require('express'),
morgan = require('morgan'),
uuid = require('uuid');

const app = express();

/*app.use functions express.static to serve "documentation.html" from the public folder
and invoke middleware function */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(morgan('common'));

//list of Users to be displayed

let users = [
  {
    id: '1',
    name: 'user1',
    username: 'user1',
    password: '1resu',
    email: 'user1@protonmail.com'
  }
]

//list of Movies to be displayed

let topMovies = [
  {
    'id': '1',
    'title': 'Oldboy',
    'director': 'Park Chan-Wook',
    'genre': [
      'Thriller',
      'Drama'
    ],
    'release_date': '2003'
  },
  {
    'id': '2',
    'title': 'Parasite',
    'director': 'Bong Joon-ho',
    'genre': [
      'Drama',
      'Comedy',
      'Thriller'
    ],
    'release_date': '2019'
  },
  {
    'id': '3',
    'title': 'The Handmaiden',
    'director': 'Park Chan-Wook',
    'genre': [
      'Romance',
      'Drama'
    ],
    'release_date': '2016'
  },
  {
    'id': '4',
    'title': 'I Saw the Devil',
    'director': 'Kim Jee-woon',
    'genre': [
      'Thriller',
      'Action'
    ],
    'release_date': '2010'
  },
  {
    'id': '5',
    'title': 'Mother',
    'director': 'Bong Joon-ho',
    'genre': 'Mystery',
    'release_date': '2009'
  },
  {
    'id': '6',
    'title': 'Joint Security Area',
    'director': 'Park Chan-Wook',
    'genre': [
      'Mystery',
      'Drama'
    ],
    'release_date': '2010'
  },
  {
    'id': '7',
    'title': 'A Bittersweet Life',
    'director': 'Kim Jee-woon',
    'genre': [
      'Action',
      'Drama'
    ],
    'release_date': '2005'
  },
  {
    'id': '8',
    'title': 'Memories of Murder',
    'director': 'Bong Joon-ho',
    'genre': [
      'Crime',
      'Thriller'
    ],
    'release_date': '2003'
  },
  {
   'id': '9',
   'title': 'The Chaser',
   'director': 'Na Hong-jin',
   'genre': [
     'Thriller',
     'Action'
   ],
   'release_date': '2008'
  },
  {
    'id': '10',
    'title': 'A Tale of Two Sisters',
    'director': 'Kim Jee-woon',
    'genre': [
      'Horror',
      'Thriller'
    ],
    'release_date': '2003'
  }
];

//GET requests

app.get('/', (req, res) => {
  let responseText = 'This will be a movie database app once I figure out what I\'m doing.';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

//GET list of movies

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//GET Movie information by title

app.get('/movies/:title', (req, res) => {
  res.json(topMovies.find((movie) =>
    {return movie.title === req.params.title }));
});

//GET Genre information by name

app.get('/movies/:genre', (req, res) => {
  res.json(topMovies.find((movie) =>
    {return movie.genre === req.params.genre }));
});

//GET Director information by name

app.get('/movies/:director', (req, res) => {
  res.json(topMovies.find((movie) =>
    {return movie.director === req.params.director }));
});

app.get('/users', (req, res) => {
  res.json(users);
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
