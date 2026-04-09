import { registerUser, logUser } from "../services/auth.service.js";

// controller for handling user registration and login
export const signUpUser = async (req, res) => {
  try {
    // extract user data from request body
    const data = req.body;
    const result = await registerUser(data);


    // send success response with user data and token in REST format
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      result: result
    });


  }

  catch (error) {
    // handle specific errors and send appropriate responses

    //email already exists so status code for this is 409(duplicate resource)
    if (error.message === "EMAIL_EXISTS") {
      return res.status(409).json({
        status: "error",
        message: "Email already exists",
        error: error.message

      });
    }

    // validation error for missing fields or invalid data  ,unprocessable entity status code is 422
    if (error.message === "VALIDATION_ERROR") {
      return res.status(422).json({
        status: "error",
        message: "Invalid input data",
        error: error.message
      });
    }

    // weak password error ,unprocessable entity status code is 422
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

// controller for handling user login
export const loginUser = async (req, res) => {
  try {
    // extract login credentials from request body
    const data = req.body;
    const result = await logUser(data);

    // send success response with user data and token in REST format
    res.status(200).json({
      status: "success",
      message: "Login successful",
      result: result
    });

  }
  catch (error) {


    // handle specific errors and send appropriate responses

    // user not found error , status code is 401 (Unauthorized)
    if (error.message === "USER_NOT_FOUND") {
      return res.status(401).json({
        status: "error",
        message: "User not found",
        error: error.message
      });
    }


    // invalid credentials error , status code is 401 (Unauthorized)
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

