import {registerUser,logUser,createAdmin,getAllAdmins,deleteAdmin} from "../services/auth.service.js";


// controller for handling user registration and login
export const signUpUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await registerUser(data);
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      result: result
    });
  }
  catch (error) {
    if (error.message === "EMAIL_EXISTS") {
      return res.status(409).json({ status: "error", message: "Email already exists", error: error.message });
    }
    if (error.message === "VALIDATION_ERROR") {
      return res.status(422).json({ status: "error", message: "Invalid input data", error: error.message });
    }
    if (error.message === "WEAK_PASSWORD") {
      return res.status(422).json({ status: "error", message: "Password is too weak", error: error.message });
    }
    return res.status(500).json({ status: "error", message: "Internal server error", error: error.message });
  }
};


// controller for handling user login
export const loginUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await logUser(data);
    res.status(200).json({
      status: "success",
      message: "Login successful",
      result: result
    });
  }
  catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(401).json({ status: "error", message: "User not found", error: error.message });
    }
    if (error.message === "VALIDATION_ERROR") {
      return res.status(422).json({ status: "error", message: "Invalid input data", error: error.message });
    }
    return res.status(500).json({ status: "error", message: "Internal server error", error: error.message });
  }
};


//SuperAdmin-only: create a new Admin account
export const createAdminController = async (req, res) => {
  try {
    const data = req.body;
    const result = await createAdmin(data);
    res.status(201).json({
      status: "success",
      message: "Admin account created successfully",
      result: result
    });
  }
  catch (error) {
    if (error.message === "EMAIL_EXISTS") {
      return res.status(409).json({ status: "error", message: "Email already exists", error: error.message });
    }
    if (error.message === "VALIDATION_ERROR") {
      return res.status(422).json({ status: "error", message: "Invalid input data", error: error.message });
    }
    if (error.message === "WEAK_PASSWORD") {
      return res.status(422).json({ status: "error", message: "Password is too weak", error: error.message });
    }
    return res.status(500).json({ status: "error", message: "Internal server error", error: error.message });
  }
};


// ─── SuperAdmin-only: get all Admin accounts ───
export const getAllAdminsController = async (req, res) => {
  try {
    const result = await getAllAdmins();
    res.status(200).json({
      status: "success",
      message: "Admins fetched successfully",
      result
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Failed to fetch admins", error: error.message });
  }
};


// ─── SuperAdmin-only: delete an Admin account ───
export const deleteAdminController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteAdmin(id);
    res.status(200).json({
      status: "success",
      message: `Admin "${result.name}" deleted successfully`,
      result
    });
  } catch (error) {
    if (error.message === "ADMIN_NOT_FOUND") {
      return res.status(404).json({ status: "error", message: "Admin not found", error: error.message });
    }
    if (error.message === "NOT_AN_ADMIN") {
      return res.status(400).json({ status: "error", message: "User is not an Admin", error: error.message });
    }
    return res.status(500).json({ status: "error", message: "Failed to delete admin", error: error.message });
  }
};
