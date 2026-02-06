// models/user.model.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{ 
        type: String,
        required: true 
    },

    email:{ 
        type: String, 
        required: true, 
        unique: true },
    passwordHash: { 
        type: String, 
        required: true },
    role:{ 
        type: String, 
        enum: ["Admin", "Customer"], 
        default: "Customer" },

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Hotel" }], 
}, 

{ timestamps: true }

);

export default mongoose.model("User", userSchema);
