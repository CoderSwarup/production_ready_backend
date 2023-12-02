// import express from 'express'
import mongoose from 'mongoose'
// import dotenv from 'dotenv'

import connectDB from './db/DBConnection.js'
import app from './app.js'

// dotenv.config()
// const app = express()
const PORT = process.env.PORT || 3000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log('MogoDB Error :', err)
  })

// import { DATABSE_NAME } from './constants.js'
//DB CONNECTION
//IIFE () Database connection
// ;(async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DATABSE_NAME}`)
//     // await mongoose.connect(`mongodb://127.0.0.1:27017/${DATABSE_NAME}`)
//     app.on('error', (err) => {
//       console.log(err)
//       throw err
//     })
//     console.log('dd')
//   } catch (error) {
//     console.log('Error ', error)
//     throw error
//   }
// })()

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`)
// })
