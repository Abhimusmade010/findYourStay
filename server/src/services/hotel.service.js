import dotenv from "dotenv";
dotenv.config();

import Hotel from '../models/hotel.model.js'


export const fetchHotels=async()=>{
    
    const hotels=await Hotel.find();
    return{
        hotels
    }

}

export const searchForHotel=async(data)=>{
    const { city, state, country } = data;

    const myhotels = await Hotel.find({
        'location.city': city,
        'location.state': state,
        'location.country': country
    });

    if(!myhotels.length) {    
        throw new Error({ message: "No hotels found for the given location" });
        //return res.status(404).json({ message: "No hotels found for the given location" });
    }
    return{
        myhotels
    }
}

export const fetchHotel=async(data)=>{
    const hotelId=data;

    const hotel=await Hotel.findById(hotelId);
    if(!hotel){
        throw new Error({message:"No Hotel Found"})
    }
    return{
        hotel
    }


}