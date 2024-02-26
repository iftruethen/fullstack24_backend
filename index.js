const express = require('express')
let morgan = require('morgan')
//const cors = require('cors')
const app = express()
app.use(express.json())
//app.use(cors())
morgan.token('postBody', (req,res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

let persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date(Date.now()).toString()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    let newPerson = request.body
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
    response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}...`)