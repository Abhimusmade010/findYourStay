import { success } from "zod";
import { registerUser, logUser } from "../services/auth.service.js";

export const signUpUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await registerUser(data);
    // result should be { token, user }
    // res.status(201).json(result);.

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        result: result  
      }); 


  }

  catch (error) {

    if (error.message === "EMAIL_EXISTS") {
      return res.status(409).json({
        status: "error",
        message: "Email already exists",
        error: error.message 

      });
    }

    if (error.message === "VALIDATION_ERROR") {
      return res.status(422).json({
        status: "error",
        message: "Invalid input data",
        error: error.message
      });
    }

    if (error.message === "WEAK_PASSWORD") {
      return res.status(422).json({
        status: "error",
        message: "Password is too weak",
        error: error.message
      });
    }

    //  fallback (unknown error)
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message

    });
  
  }
};


export const loginUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await logUser(data);
    // result should be { token, user }
    // res.status(200).json(result);

      res.status(200).json({  
        status: "success",
        message: "Login successful",
        result: result
      });

  }
  catch (error) {

    // res.status(400).json({ 
    //   message: "Login failed",
    //   error: error.message 
    // });

     if(error.message==="USER_NOT_FOUND "){
      return res.status(401).json({
        status: "error",
        message: "User not found",
        error: error.message
      });
    }
      
    

    if (error.message === "VALIDATION_ERROR") {
      return res.status(422).json({
        status: "error",
        message: "Invalid input data",

        error: error.message
      });
    }
      

    //  fallback (unknown error)
    
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });

  }
};

