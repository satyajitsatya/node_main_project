import { Router } from "express";
import { resetAccessToken, userLogin, userLogout, userRegister , } from "../controllers/user.controller.js";
import { uploads } from "../middlewares/multer.middleware.js";
import { authVerify } from "../middlewares/auth.middleware.js";

const userRouter = Router();

  userRouter.route('/register').post( uploads.fields([ {name: 'avatar' ,  maxCount: 1},{ name: 'coverImage' , maxCount: 1}]) ,userRegister)

  userRouter.route("/login").post(userLogin);

  //authenticated routes
  userRouter.route('/logout').post(authVerify , userLogout);
  userRouter.route('/reset-accessToken').post(resetAccessToken)
  userRouter.route('/home').get((req, res ) => {
    res.send(
    "this is working smoothly"
    )
  })

 export default userRouter