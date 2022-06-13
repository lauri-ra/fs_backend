const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Missing password')
    process.exit(1)
}

const password = process.argv[2]

const url  = 
`mongodb+srv://fullstack:${password}@fullstack.w4z1g.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    id: Math.floor(Math.random() * 1000) + 1,
    name: process.argv[3],
    number: process.argv[4],
})

if(process.argv.length === 3) {
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person)
            })
        mongoose.connection.close()
        })
}

if(process.argv.length > 3) {
    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}