const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
// eslint-disable-next-line no-undef
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('succesfully connected'))
    .catch(error => console.log(`failed to connect ${error.message}`))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
    },
    number: { 
        type: String,
        minlength: 8,
        validate: {
            validator: v => {
                return ( v.split('-').length === 2 && (/\d{2}-\d{6}/.test(v) || /\d{3}-\d{5}/.test(v)) )
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'User phone number required']  
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