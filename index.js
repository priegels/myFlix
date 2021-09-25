const express = require('express'),
app = express();

//express.static to server "documentation.html" from the public folder

app.use(express.static('public'));

//list of Movies to be displayed 

let topMovies = [
  {
    title: 'Oldboy',
    director: 'Park Chan-Wook',
    genre: [
      'Thriller', 
      'Drama'
    ],
    release_date: '2003'
  },
  {
    title: 'Parasite',
    director: 'Joon-Ho Bong',
    genre: [
      'Drama', 
      'Comedy', 
      'Thriller'
    ],
    release_date: '2019'
  },
  {
    title: 'The Handmaiden',
    director: 'Park Chan-Wook',
    genre: [
      'Romance', 
      'Drama'
    ],
    release_date: '2016'
  },
  {
    title: 'I Saw the Devil',
    director: 'Kim Jee-woon',
    genre: [
      'Thriller', 
      'Action'
    ],
    release_date: '2010'
  },
  {
    title: 'Mother',
    director: 'Bong Joon-ho',
    genre: 'Mystery',
    release_date: '2009'
  },
  {
    title: 'Joint Security Area',
    director: 'Park Chan-Wook',
    genre: [
      'Mystery', 
      'Drama'
    ],
    release_date: '2010'
  },
  {
    title: 'A Bittersweet Life',
    director: 'Kim Jee-woon',
    genre: [
      'Action', 
      'Drama'
    ],
    release_date: '2005'
  },
  {
    title: 'Memories of Murder',
    director: 'Bong Joon-ho',
    genre: [
      'Crime', 
      'Thriller'
    ],
    release_date: '2003'
  },
  {
   title: 'The Chaser',
   director: 'Na Hong-jin',
   genre: [
     'Thriller', 
     'Action'
   ],
   release_date: '2008' 
  },
  {
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

// listen for requests

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});