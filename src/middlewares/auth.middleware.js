import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/apiError.js";
import { User } from "../models/user.model.js";

export const authVerify = asyncHandler( async (req , res , next) =>{

try {
    //   get token form requast
    //   const token = req.cookies?.accessToken || req.header("Authorization")?.replace('Bearer' , '');
    // const token = req.cookies?.accessToken || req.header("Authorization")?.replace('Bearer ', '');
    const bearerToken = req.header("Authorization");
    const token = req.cookies?.accessToken || (bearerToken?.startsWith("Bearer ") ? bearerToken.slice(7) : undefined);

      if(!token)
      {
        throw new ApiErrors(400, "Unauthorized request ");
      }

      
  
    //   verify this token is valid or not
      const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRETE);
    
      if(!decodedToken)
      {
        throw new ApiErrors(401 , "Invalid Token")
      }
    
    
    //fetch user details from user model
    const user =await User.findById(decodedToken?._id).select("-password -refreshToken");
    if(!user)
    {
        throw new ApiErrors(402 , " User not found");
    }
    
    //set user object on  request
    req.user = user;
    next()
} catch (error) {
      throw new ApiErrors(500, error?.message ||"somthing went wrong while token procces")
}

})