const express = require('express'),
morgan = require('morgan');

const app = express();

/*app.use functions express.static to serve "documentation.html" from the public folder
and invoke middleware function */

app.use(express.static('public'));
app.use(morgan('common'));

//list of Movies to be displayed 

let topMovies = [
  {
    id: '1',
    title: 'Oldboy',
    director: 'Park Chan-Wook',
    genre: [
      'Thriller', 
      'Drama'
    ],
    release_date: '2003'
  },
  {
    id: '2',
    title: 'Parasite',
    director: 'Bong Joon-ho',
    genre: [
      'Drama', 
      'Comedy', 
      'Thriller'
    ],
    release_date: '2019'
  },
  {
    id: '3',
    title: 'The Handmaiden',
    director: 'Park Chan-Wook',
    genre: [
      'Romance', 
      'Drama'
    ],
    release_date: '2016'
  },
  {
    id: '4',
    title: 'I Saw the Devil',
    director: 'Kim Jee-woon',
    genre: [
      'Thriller', 
      'Action'
    ],
    release_date: '2010'
  },
  {
    id: '5',
    title: 'Mother',
    director: 'Bong Joon-ho',
    genre: 'Mystery',
    release_date: '2009'
  },
  {
    id: '6',
    title: 'Joint Security Area',
    director: 'Park Chan-Wook',
    genre: [
      'Mystery', 
      'Drama'
    ],
    release_date: '2010'
  },
  {
    id: '7',
    title: 'A Bittersweet Life',
    director: 'Kim Jee-woon',
    genre: [
      'Action', 
      'Drama'
    ],
    release_date: '2005'
  },
  {
    id: '8',
    title: 'Memories of Murder',
    director: 'Bong Joon-ho',
    genre: [
      'Crime', 
      'Thriller'
    ],
    release_date: '2003'
  },
  {
   id: '9',
   title: 'The Chaser',
   director: 'Na Hong-jin',
   genre: [
     'Thriller', 
     'Action'
   ],
   release_date: '2008' 
  },
  {
    id: '10',
    title: 'A Tale of Two Sisters',
    director: 'Kim Jee-woon',
    genre: [
      'Horror', 
      'Thriller'
    ],
    release_date: '2003'
  }
];

//GET requests

app.get('/', (req, res) => {
  let responseText = 'This will be a movie database app once I figure out what I\'m doing.';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/movies/:title', (req, res) => {
  res.json(topMovies.find((movie) =>
    {return movie.title === req.params.title }));
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