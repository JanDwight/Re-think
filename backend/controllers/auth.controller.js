import  bcryptjs from 'bcryptjs';

import { User } from '../models/user.model.js';
import { verificationTokenGenerator } from '../utils/verificationTokenGenerator.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail } from '../mailtrap/emails.js';

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
      verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000 // 1 hour
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

export const login = async (req,res) => {
  res.send("Login route");
};

export const logout = async (req,res) => {
  res.send("Logout route");
};