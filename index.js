const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', request => {
    if(request.method === 'POST') {
        return JSON.stringify(request.body)
    }
})

const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(cors())

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-23-6423122'
    }
]

const createId = () => {
    const id = Math.floor(Math.random() * 1000) + 1

    return id
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
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

    const found = persons.find(person => person.name === body.name)

    if(found) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }
    
    const person = {
        id: createId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})