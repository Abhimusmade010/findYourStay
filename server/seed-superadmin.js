//  seed-superadmin.js — Run ONCE to create the first SuperAdmin


//  Usage:  node seed-superadmin.js

//  This script:
//    1. Connects to your MongoDB (using MONGO_URI from .env)
//    2. Checks if a SuperAdmin already exists
//    3. If not, creates one with hashed password
//    4. Disconnects and exits

//  You only need to run this ONCE when setting up the project.
//  After the SuperAdmin exists, they can create Admins via the
//  /api/auth/create-admin route from the Super Admin Dashboard.


import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./src/models/user.model.js";


//  SuperAdmin credentials (change these!)
const SUPER_ADMIN = {
  name: process.env.SUPER_ADMIN_NAME,
  email: process.env.SUPER_ADMIN_EMAIL,
  password: process.env.SUPER_ADMIN_PASSWORD   
};



const seedSuperAdmin = async () => {
  console.log(process.env.MONGO_URI);
  
  try {
    // Step 1: Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
   

    // Step 2: Check if a SuperAdmin already exists
    const existingSuperAdmin = await User.findOne({ role: "SuperAdmin" });

    if (existingSuperAdmin) {
      await mongoose.disconnect();
      process.exit(0);
    }


    // Step 3: Hash the password
    const passwordHash = await bcrypt.hash(SUPER_ADMIN.password, 10);


    // Step 4: Create the SuperAdmin in the database
    const superAdmin = await User.create({
      name: SUPER_ADMIN.name,
      email: SUPER_ADMIN.email,
      passwordHash,
      role: "SuperAdmin",
      wishlist: [],
    });
    console.log("✅ SuperAdmin created successfully:");
    console.log(`   Name: ${superAdmin.name}`);
    console.log(`   Email: ${superAdmin.email}`);

  
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);

  } finally {
    // Step 5: Always disconnect, whether success or failure
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB disconnected");
    process.exit(0);
  }
};


seedSuperAdmin();
