require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movie.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())


app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    console.log(authToken.split(' ')[1])
    console.log(apiToken)
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
})


app.get('/movie', function handleGetMovies(req, res) {
    let response = MOVIES;
    const { genre='', country='', avg_vote=null } = req.query;

    if(genre){
        response = response.filter(movie =>
            // case insensitive searching
            movie.genre.toLowerCase().includes(genre.toLowerCase()));
    }

    if(country){
        response = response.filter(movie =>
            // case insensitive searching
            movie.country.toLowerCase().includes(country.toLowerCase()));
    }

    if(avg_vote){
        response = response.filter(movie =>
            // case insensitive searching
            movie.avg_vote >= parseFloat(avg_vote));
    }

    res.json(response)
})


const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})