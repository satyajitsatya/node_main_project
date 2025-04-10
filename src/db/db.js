import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () =>{
    try {
      const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      console.log(`mongo db connected successfully !! HOST: ${conn.connection.host}`)
    } catch (error) {
        console.log('database connection faild' , error)
        process.exit(1)
    }
}

export default connectDb