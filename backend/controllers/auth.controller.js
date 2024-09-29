import  bcryptjs from 'bcryptjs';

import { User } from '../models/user.model.js';
import { verificationTokenGenerator } from '../utils/verificationTokenGenerator.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/emails.js';

export const signup = async (req,res) => {
  const { email, password } = req.body;

  try {
    if(!email || !password) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({email});
    if (userAlreadyExists) {
      return res.status(400).json({success:false, message:"User already exists"});
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = verificationTokenGenerator();
    const user = new User({
      email,
      password,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hour
    });

    await user.save();

    // jwt
    generateTokenAndSetCookie(res, user._id);

    // mailtrap email verification
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfuly",
      user: {
        ...user._doc,
        password: undefined,
      }
    });

  } catch (error) {
    res.status(400).json({success:false, message: error.message});
  }
};

export const verifyEmail = async (req,res) => {
  const {code} = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }
    });

    if(!user){
      return res.status(400).json({success: false, message: "Invalid or expired verification code"})
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // Welcome message
    await sendWelcomeEmail(user.email, user.name);
    
    res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
  } catch (error) {
    console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
  }

};

export const login = async (req,res) => {
  res.send("Login route response");
};

export const logout = async (req,res) => {
  res.send("Logout route response");
};