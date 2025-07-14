import mongoose from 'mongoose'

export async function connectToDatabase() {
  await mongoose.connect('mongodb://localhost:27017/getapet')
  console.log('Conexão estabelecida')
}

connectToDatabase().catch((err) => console.log(err)) 