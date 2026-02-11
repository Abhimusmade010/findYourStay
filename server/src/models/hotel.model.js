// models/hotel.model.js
import mongoose from "mongoose";


const hotelSchema = new mongoose.Schema({

    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String,  
        required: true
    },
    location: {
        city: String,
        state: String,
        country: String,
        address: String
    },
    pricePerNight: { 
        type: Number, 
        required: true
    },
    amenities: [String],   //facilities
    images: [String],
    availability: { type: Boolean,
         default: true 
    },
    bookedDates: {
        type: [[Date]],
        default: []
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

}, { timestamps: true });


export default mongoose.model("Hotel", hotelSchema);
