
import connectDb from "./db/db.js";
import dotenv from "dotenv";


dotenv.config({
    path: './env'
})

connectDb();

































// import mongoose from "mongoose";
// import e from "express";
// import { DB_NAME } from "./constants";
// const app = e();
// const port = process.env.PORT || 3000 ;


// (async ()=>{
//     try {    
//         const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on('error' , (error) => {
//             console.log('ERROR :',error)
//             // throw error
//         })
//         app.listen(port , () => {
//             console.log(`app listenig on port${port}`)
//         })
//     } catch (error) {
//         console.log('ERROR :',error)
//         // throw error
//     }
// }) ()
// app.get('/', (req ,res ) =>{
//     res.send('ok');
// })