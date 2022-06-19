require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', request => {
    if(request.method === 'POST') {
        return JSON.stringify(request.body)
    }
})

const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))

const createId = () => {
    const id = Math.floor(Math.random() * 1000) + 1

    return id
}

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons)
        })
})

app.get('/info', (request, response) => {
    const count = persons.length
    const date = new Date()

    response.send(
        `<div> 
            <p>Phonebook has info for ${count} people<p>
            <p>${date}<p>
        </div>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id =  Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (requests, response) => {
    const body = requests.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'Person data missing'
        })
    }
    
    const person = new Person({
        id: createId(),
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})