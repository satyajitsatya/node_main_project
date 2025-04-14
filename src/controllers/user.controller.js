import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";


const userRegister = asyncHandler(async (req , res ) => {
   //   res.status(200).json({
   //      message : "Working"
   //   })

   //get user data from frontend
   const{fullName , email , username , avatar , coverImage , password} =req.body
   


   //applay all posible validation

   if( [fullName , email , username , password].some( (field) => field?.trim() === ''))
   {
      throw new ApiErrors(400, " please fill the required fields");
      
   }

   const userAxist =await User.findOne({ $or: [{username},{email}]})
 
   if(userAxist)
   {
      throw new ApiErrors(400, "this user arledy exist");
      
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   
   let coverImageLocalPath;   
   if(req.files && Array.isArray(req.files.coverImage))
   {
       coverImageLocalPath = req.files.coverImage[0].path
   }

   if (avatarLocalPath === "") {
       throw new ApiErrors(401 , "avatar field is require")
   }
   console.log(coverImageLocalPath);

   // if(!fullName)
   // {
   //    throw new ApiErrors(400, "fullName can not be null")
      
   // }

   //if have files then store this files in local storage in public folder using multer 


   //then store user data in data base
  const newUser = await  User.create( {
      fullName : fullName,
      username : username,
      email : email,
      password : password,
      avatar : avatarLocalPath,
      coverImage : coverImageLocalPath || "",

   })

const createdUser = await User.findById(newUser._id).select(" -password -refreshToken")

if(!createdUser)
{
   throw new ApiErrors(500 ,"some thing went wrong during user creation")
}

return res.status(200).json(
   new ApiResponse (200, createdUser , "User created successfully")
)


}) 

export {userRegister}