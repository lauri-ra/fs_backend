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
    Person
        .find({})
        .then(persons => {
            const count = persons.length
            const date = new Date()

            response.send(
                `<div> 
                    <p>Phonebook has info for ${count} people<p>
                    <p>${date}<p>
                </div>`
            )
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(
            response.status(204).end()
        )
        .catch(error => next(error))
})

app.post('/api/persons', (requests, response, next) => {
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

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (requests, response, next) => {
    const body = requests.body

    const person = {
        id: body.id,
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(requests.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})