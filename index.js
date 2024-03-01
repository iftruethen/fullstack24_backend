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
        console.log(result)
        response.json(result)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(result => {
        const personCount = result.length
        response.send(`<p>Phonebook has info for ${personCount} people</p><p>${Date(Date.now()).toString()}</p>`)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(result => {
            response.json(result)
        })
        .catch(result => {
            response.status(404).end()
        })
})

app.delete('/api/persons/:id', (request, response) => {
    console.log(request.params.id)
    response.status(403).end()
    /* Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        }) */
})

app.post('/api/persons', (request, response) => {
    const newPerson = new Person(request.body)
    /* Person.find({name:request.body.name})
        .then(result => {
            console.log(result)
            if (result) {
                response.status(403).send(`Error: person with specified name already exists`).end()
            }
        })
    if (!newPerson.name || !newPerson.number) {
        let errorMessage = ''
        !newPerson.name ? errorMessage='name missing' : errorMessage='number missing'
        response.status(403).send(`Error: ${errorMessage}`).end()
    } */
    newPerson.save()
        .then(result => {
            response.status(201).json(request.body)
        })
        .catch(error => {
            response.status(403).end()
        })
    
    /* let newPerson = request.body
    if (!newPerson.name || !newPerson.number) {
        let errorMessage = ""
        if (!newPerson.name) {errorMessage = "name missing"}
        else if (!newPerson.number) {errorMessage = "number missing"}
        return response.status(403).send(`Error: ${errorMessage}`)
    }
    const alreadyExist = persons.find(p => p.name.toLowerCase() === newPerson.name.toLowerCase())
    if (alreadyExist) {return response.status(403).send(`Error: person with specified name already exists`)}
    const id = Math.floor(Math.random()*10000)
    newPerson = {...newPerson, id:id}
    persons = persons.concat(newPerson)
    response.json(newPerson) */
})

app.put('/api/persons/:id', (request, response) => {
    console.log("handle put request")
    response.status(200).end()
    /* const id = Number(request.params.id)
    persons = persons.map(p => p.id === id ? request.body : p)
    response.json(request.body) */
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}...`)