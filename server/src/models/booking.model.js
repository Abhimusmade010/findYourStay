// models/booking.model.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  checkIn: { type: Date, required: true },

  checkOut: { type: Date, required: true },

  totalPrice: { type: Number, required: true },


  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled", "Completed"], default: "Pending" },


  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
