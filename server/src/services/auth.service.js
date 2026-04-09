import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//service function for handling user registration
const registerUser = async (data) => {
  //data came from the controller which is from the request body
  const { name, email, password, role } = data;

  if (!name || !email || !password) {
    throw new Error("VALIDATION_ERROR");
  }

  //check if user with the same email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("EMAIL_EXISTS");
  }

  // check for weak password (example: password should be at least 6 characters),we already have validation using middleware using zod but this is an additional check for password strength
  if (password.length < 6) {
    throw new Error("WEAK_PASSWORD");
  }

  //hash the password before saving to database 
  // with salting rounds of 10 ,saliting is for security to make it more difficult for attackers to crack the password hash 
  // because it adds random data to the input of the hash function, so even if two users have the same password, their hashes will be different due to different salts
  const passwordHash = await bcrypt.hash(password, 10);

  // create new user in the database with the hashed password and default role as "Customer" if role is not provided
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: role || "Customer"
  });

  //token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  return { 
    name,
    email,
    role,
    token 
};
};

const logUser = async (data) => {


  const { email, password } = data;


  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  
  if (!isMatch) {
    throw new Error("VALIDATION_ERROR");
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // console.log("Generated token:", token);
  // console.log("Dot count at login:", token.split(".").length - 1);


  return {
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

export { registerUser, logUser };
