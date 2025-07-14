import mongoose from '../db/connection.js'
import { Schema } from 'mongoose'

export const User = mongoose.model(
  'User',
  new Schema({
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      image: {
        type: String
      },
      phone: {
        type: String,
        required: true
      },
    },
    { timestamps: true }
  )
)