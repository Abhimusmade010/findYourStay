
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//Helper: shared logic for creating a user
const buildUser = async ({ name, email, password, role }) => {

  if (!name || !email || !password) {
    throw new Error("VALIDATION_ERROR");
  }

  // check if user with the same email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("EMAIL_EXISTS");
  }

  // additional check for password strength (Zod middleware also validates, this is defense-in-depth)
  if (password.length < 6) {
    throw new Error("WEAK_PASSWORD");
  }

  // hash the password before saving to database
  // salting rounds of 10 adds random data so identical passwords produce different hashes
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
  });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  };
};

//Public registration: role is always set to "Customer" server-side, client cannot specify it
const registerUser = async (data) => {
  const { name, email, password } = data;
  return buildUser({ name, email, password, role: "Customer" });
};


//Admin creation: role is always set to "Admin" server-side, client cannot specify it
const createAdmin = async (data) => {
  const { name, email, password } = data;
  return buildUser({ name, email, password, role: "Admin" });
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

// ─── SuperAdmin: get all Admin accounts ───
const getAllAdmins = async () => {
  const admins = await User.find({ role: "Admin" })
    .select("-passwordHash")
    .sort({ createdAt: -1 });
  return admins;
};

// ─── SuperAdmin: delete an Admin account ───
const deleteAdmin = async (adminId) => {
  const admin = await User.findById(adminId);
  if (!admin) {
    throw new Error("ADMIN_NOT_FOUND");
  }
  if (admin.role !== "Admin") {
    throw new Error("NOT_AN_ADMIN");
  }
  await User.findByIdAndDelete(adminId);
  return { id: adminId, name: admin.name, email: admin.email };
};

export { registerUser, logUser, createAdmin, getAllAdmins, deleteAdmin };

//so what i did, one SuperAdmin is seeded in the database when the project is set up for the first time.
// Only the SuperAdmin can create Admin accounts via the protected /create-admin route.
// Admins manage hotels and bookings. The registerUser service is public and always creates a Customer account,
// regardless of any role field sent by the client (which is ignored).
