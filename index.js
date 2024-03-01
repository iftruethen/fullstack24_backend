require('dotenv').config()
const Person = require("./models/mongo")
const express = require('express')  // importing HTTP server library
let morgan = require('morgan')  // importing HTTP body content parser
const cors = require('cors')  // importing cross origin policy (CORS) tool
const app = express()  // invoking express HTTP server library
app.use(express.json())  // invoking JSON parser
app.use(cors())  // invoking cors library
app.use(express.static('dist'))  // invoking built frontend
// invoking morgan to print incoming HTTP requests to console:
morgan.token('postBody', (req,res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(result => {
        const personCount = result.length
        response.send(`<p>Phonebook has info for ${personCount} people</p><p>${Date(Date.now()).toString()}</p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => {
            if (result) {
                response.json(result)
            } else {
                response.status(404).end()
            }            
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const newPerson = new Person(request.body)
    Person.find({name:request.body.name})
    .then(result => {
        if (result.length === 0) {
            newPerson.save()
            .then(result => {
                response.status(201).json(request.body)
            })
            .catch(error => next(error))
        } else {
            response.status(409).end()
        }
    })
    
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).end()
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}...`)