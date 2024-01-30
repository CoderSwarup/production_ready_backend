import mongoose from 'mongoose'
import { DATABSE_NAME } from '../constants.js'

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DATABSE_NAME}`,
    )
    console.log('Data base Connect on : ', connectionInstance.connection.host)
  } catch (error) {
    console.log('Error ', error)
    process.exit(1)
  }
}

export default connectDB
