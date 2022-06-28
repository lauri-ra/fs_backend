const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

console.log('connecting to', url)
mongoose.connect(url)
    .then(
        console.log('connected to MongoDB')
    )
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const validator = (pnum) => {
    if(pnum.length >= 8 && pnum.includes('-')) {
        const pnumSplit = pnum.split('-')

        if(pnumSplit[0].length > 1 && pnumSplit[0].length < 4) {
            return true
        }
    }
    return false
}

const validateNumber = [validator, 'Phone number is in incorrect format']

const personSchema = new mongoose.Schema({
    id: Number,
    name: {
        type: String,
        minlength: 5,
    },
    number: {
        type: String,
        validate: validateNumber,
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)