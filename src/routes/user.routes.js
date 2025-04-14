import { Router } from "express";
import { userRegister } from "../controllers/user.controller.js";
import { uploads } from "../middlewares/multer.middleware.js";

const userRouter = Router();

  userRouter.route('/register').post( uploads.fields([ {name: 'avatar' ,  maxCount: 1},{ name: 'coverImage' , maxCount: 1}]) ,userRegister)
  
  userRouter.route('/home').get((req, res ) => {
    res.send(
    "this is working smoothly"
    )
  })

 export default userRouter