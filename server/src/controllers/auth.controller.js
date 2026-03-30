import { success } from "zod";
import { registerUser, logUser } from "../services/auth.service.js";

export const signUpUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await registerUser(data);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      result
    });
  } 

  catch (error) {

    if (error.message === "EMAIL_EXISTS") {
      return res.status(409).json({
        status: "error",
        message: "Email already exists"
      });
    }

    if (error.message === "VALIDATION_ERROR") {
      return res.status(422).json({
        status: "error",
        message: "Invalid input data"
      });
    }

    if (error.message === "WEAK_PASSWORD") {
      return res.status(422).json({
        status: "error",
        message: "Password is too weak"
      });
    }

    //  fallback (unknown error)
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  
  }
};


export const loginUser = async (req, res) => {
  try {

    const data = req.body;
    const result = await logUser(data);

    res.status(200).json(
      {
        status: "success",
        message: "Login successful",
        result
      }
    );

  } 
  catch (error) {

    // res.status(400).json({ 
    //   message: "Login failed",
    //   error: error.message 
    // });

     if(error.message==="USER_NOT_FOUND "){
      return res.status(401).json({
        status: "error",
        message: "User not found"
      });
    }

    if (error.message === "VALIDATION_ERROR") {
      return res.status(422).json({
        status: "error",
        message: "Invalid input data"
      });
    }

    //  fallback (unknown error)
    
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });

  }
};

