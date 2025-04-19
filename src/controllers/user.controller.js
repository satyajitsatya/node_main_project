import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { json, response } from "express";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors(
      500,
      "some thing went wrong while generating the token"
    );
  }
};

const userRegister = asyncHandler(async (req, res) => {
  //   res.status(200).json({
  //      message : "Working"
  //   })

  //get user data from frontend
  const { fullName, email, username, avatar, coverImage, password } = req.body;

  //applay all posible validation

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiErrors(400, " please fill the required fields");
  }

  const userAxist = await User.findOne({ $or: [{ username }, { email }] });

  if (userAxist) {
    throw new ApiErrors(400, "this user arledy exist");
  }

  //   const avatarLocalPath = req.files?.avatar[0]?.path;
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage)) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiErrors(401, "avatar field is require");
  }
  console.log(coverImageLocalPath);

  // if(!fullName)
  // {
  //    throw new ApiErrors(400, "fullName can not be null")

  // }

  //if have files then store this files in local storage in public folder using multer

  //then store user data in data base
  const newUser = await User.create({
    fullName: fullName,
    username: username,
    email: email,
    password: password,
    avatar: avatarLocalPath,
    coverImage: coverImageLocalPath || "",
  });

  const createdUser = await User.findById(newUser._id).select(
    " -password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiErrors(500, "some thing went wrong during user creation");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const userLogin = asyncHandler(async (req, res) => {
  //get the login data from frontend
  const { username, email, password } = req.body;
  //check user properly give data
  if (!(username || email || password)) {
    throw new ApiErrors(400, "please fill the all required field");
  }

  //match the given username or email and password is correct

  const validUser = await User.findOne({ $or: [{ username }, { email }] });

  if (!validUser) {
    throw new ApiErrors(400, "username or email is invalid");
  }

  const isValidPassword = await validUser.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiErrors(400, "Your password is invalid");
  }

  //create access and refresh token

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    validUser._id
  );

  const loggdInUser = await User.findById(validUser._id).select(
    -password - refreshToken
  );

  //send cookie
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        { user: loggdInUser, accessToken, refreshToken },
        "User login successfully"
      )
    );

  // if give attributs are match then login user successfully
});

const userLogout = asyncHandler((req, res) => {
  //  uthenticate user this user arledy loggdin or not
  //then remove accessToken in data base
  const user = User.findOneAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );
  //remove cookies
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const resetAccessToken = asyncHandler(async (req , res) =>{

   //get refreshToken from user
   const refreshToken = req.cookies?.refreshToken || req.body.refreshToken ;
   if(!refreshToken)
   {
      throw new ApiErrors(402, "UnAuthorized requist");
   }

  try {
    //decod and verify refreshToken
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRETE)
 
    if(!decodedToken)
    {
       throw new ApiErrors(402, "invalid token");
    }
 
    const user = User.findById(decodedToken._id).select("-password");
 
    if(!user)
    {
       throw new ApiErrors(402,"invalid refreshToken");
    }
    if(refreshToken != user?.refreshToken)
    {
       throw new ApiErrors(402,"invalid refreshToken");
    }
 
    //resetAccessToken
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user?._id);
 
    const option = {
       httpOnly : true,
       secure : true
    }
 
    return res.status(200)
    .cookie("accessToken",accessToken, option)
    .cookie("refreshToken",newRefreshToken, option)
    .json(
    new ApiResponse(200, {user , accessToken, refreshToken :newRefreshToken} , "reset accessToken successfully")
    );
  } catch (error) {
    throw new ApiErrors(500, error?.message || "some thing went wrong while generate accessToken");
  }

})

export { userRegister, userLogin, userLogout ,resetAccessToken };
