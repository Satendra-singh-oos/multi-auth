//normal-aut :DONE
//otp-auth
//singup with google
//singup with github
//login with google
//login with github
//login wile email pass

import { Request, Response } from "express";
import {
  loginSchemaValidation,
  otpSchemaValidation,
  userModelValidation,
} from "../utils/user.validation";
import { User } from "../models/user.model";
import { sendVerificationEmail } from "../utils/sendVerificationEmail";

const registerWithoutOtp = async (req: Request, res: Response) => {
  try {
    const { error, data } = userModelValidation.safeParse(req.body);

    if (error) {
      return res.status(405).json({
        error: error.message,
      });
    }

    const { email, username, password } = data;

    //check if email or username alredy exist in db

    const checkUserExist = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (checkUserExist) {
      return res.status(402).json({
        success: false,
        message: "Username Or Email Already exist in db",
      });
    }

    const checkUserExistAndVerified = await User.findOne({
      $and: [{ email }, { isVerified: true }],
    });

    if (checkUserExistAndVerified) {
      return res.status(402).json({
        success: false,
        message: "Email Already exist  and verified in db",
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      isVerified: true,
    });

    const userId = newUser._id;

    const createdUser = await User.findById(userId).select(
      "-password -verifyOtpExpiry -verifyOtp -refreshToken"
    );

    if (!createdUser) {
      return res.status(200).json({
        success: false,
        message: "Something Went Wrong Will Createing User",
      });
    }
    return res.status(200).json({
      success: true,
      data: createdUser,
    });
  } catch (error: any) {
    return res.status(500).json({
      err: error.message,
    });
  }
};

// email with otp verify

const registerWithOtp = async (req: Request, res: Response) => {
  try {
    const { error, data } = userModelValidation.safeParse(req.body);

    if (error) {
      return res.status(405).json({
        error: error.message,
      });
    }

    const { email, username, password } = data;

    //check if username alredy exist in db also verified

    const existingUserVerifiedByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    /*3 case there are 
    1) username and email is registered and isVerified is true 
    2) username and email is present in db but it is not verified(so send new otp to the mail and update the otp related field)
    3) username and email are coming first time 
    */
    if (existingUserVerifiedByUsername) {
      return res.status(409).json({
        success: false,
        message: "Username & email already taken",
      });
    }

    const existingUserByEmail = await User.findOne({
      email,
    });

    const verifyOtp = Math.floor(100000 + Math.random() * 90000).toString();
    if (existingUserByEmail) {
      //is alredy verified else otp

      if (existingUserByEmail.isVerified) {
        return res.status(409).json({
          success: false,
          message: "Username & email already taken & verified",
        });
      } else {
        existingUserByEmail.verifyOtp = verifyOtp;
        existingUserByEmail.verifyOtpExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      // user come to the db first time
      const verifyOtpExpiry = new Date();
      verifyOtpExpiry.setHours(verifyOtpExpiry.getHours() + 1);

      const createUser = new User({
        username,
        email,
        password,
        verifyOtp,
        verifyOtpExpiry,
      });

      await createUser.save();
    }

    // so now we need to send verification maile in all the above cases so we will send

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyOtp
    );

    if (emailResponse.statusMessage != "Created") {
      return res.status(200).json({
        message: "Some thing went wrong during sending email",
      });
    }

    console.log(emailResponse);

    return res.status(200).json({
      success: true,
      data: {
        userEmail: email,
      },
      message: "User Registerd Succesfully ! Kindly Verify Your Email",
    });
  } catch (error: any) {
    return res.status(500).json({
      err: error.message,
    });
  }
};

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { error, data } = otpSchemaValidation.safeParse(req.body);

    if (error) {
      return res.status(405).json({
        error: error.message,
      });
    }

    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(405).json({
        message: "User Dose not exist",
      });
    }

    const isOtpValid = user.verifyOtp === otp;

    if (!user.verifyOtpExpiry) {
      return res.status(200).json({
        message: "Register Again ",
      });
    }
    const isOtpNotExpired = new Date(user.verifyOtpExpiry) > new Date();

    if (isOtpNotExpired && isOtpValid) {
      user.isVerified = true;
      await user.save();
      return res.status(200).json({
        message: "User Verified Succesfully",
      });
    } else if (!isOtpNotExpired) {
      return res.status(404).json({
        message:
          "Verification Code Has exipred please signup again to get a new Code",
      });
    } else {
      return res.status(404).json({
        message: "Invalid Otp",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      err: error.message,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { error, data } = loginSchemaValidation.safeParse(req.body);

    if (error) {
      return res.status(405).json({
        error: error.message,
      });
    }
    const { email, password } = data;

    const user = await User.findOne({
      email,
      isVerified: true,
    });

    if (!user) {
      return res.status(404).json({
        message:
          "User is not found with this email kindly register Or Try To Login Throw other oAuthProvider",
      });
    }

    const isPasswrodCorrect = await user.isPasswordCorrect(password);

    if (!isPasswrodCorrect) {
      return res.status(403).json({
        message: "Password is not correct",
      });
    }

    const accessToken = await user.generateAccessToken();

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none" as "none",
    };
    const loggedInUser = await User.findById(user._id).select(
      "-password -verifyOtp -verifyOtpExpiry"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({
        data: {
          user: loggedInUser,
        },
        message: "User Logged in succesfully",
      });
  } catch (error: any) {
    return res.status(500).json({
      err: error.message,
    });
  }
};

export { registerWithOtp, registerWithoutOtp, verifyOtp, loginUser };
