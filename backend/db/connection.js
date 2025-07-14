const mongoose = require('mongoose')

async function connectToDataBase() {
  await mongoose.connect('mongodb://localhost:27017/getapet')
  console.log('Conectou com Mongoose!')
}

connectToDataBase().catch((err) => console.log(err))

module.exports = mongoose