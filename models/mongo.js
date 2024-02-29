const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide database password as argument')
    process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.lnngtp6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(n => console.log(n.name, n.number))
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const personToAdd = new Person({
        name: newName,
        number: newNumber
    })

    personToAdd.save().then(result => {console.log(result); mongoose.connection.close()})
}