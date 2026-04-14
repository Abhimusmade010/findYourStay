// import dotenv from "dotenv";
// dotenv.config();

import Hotel from "../models/hotel.model.js"

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
        throw new Error( "No hotels found for the given location" );
    }
    return{
        myhotels
    }
}

export const fetchHotel=async(data)=>{
    

    const hotel=await Hotel.findById(data);
    
    // console.log("Hotel from getoneHotel is",hotel);

    if(!hotel){
        
        throw new Error("No Hotel Found");
    }
    return{
        hotel   
    }
}

export const addHotel=async(data,userID)=>{
    
    const newHotel=await Hotel.create({
        ...data,
        createdBy:userID
    })
    

    return newHotel;
}


// export const delHotel=async(id,userID)=>{
    
//     const hotel=await Hotel.findById(id);
//     if(!hotel){
//         throw new Error ({message:"hotel not found"});

//     }
//     const deleted=await Hotel.deleteOne(id);
//     return {
//         deleted
//     }
// }


export const modifyHotel=async(id,data,userId)=>{


    const existingHotel = await Hotel.findById(id);
    if (!existingHotel) {
        throw new Error("Hotel not found");
    }
    if (existingHotel.createdBy.toString() !== userId.toString()) {
        throw new Error("You are not authorized to update this hotel");
    }
    
    const updated=await Hotel.findByIdAndUpdate(
        id,
        data,
        {
            new:true
        }
    );

    return updated;
}

export const adminHotels = async (userId) => {

  if (!userId) {
    throw new Error("UserID is required");
  }

  const result = await Hotel.find(
    { 
        createdBy: userId 
    })
    .populate("createdBy", "name email role");      // optional


  return result;

};


// ─── SuperAdmin: get ALL hotels with admin info ───
export const fetchAllHotelsWithAdmin = async () => {
  const hotels = await Hotel.find()
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });
  return hotels;
};


// ─── SuperAdmin: delete any hotel by ID ───
export const removeHotel = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    throw new Error("Hotel not found");
  }
  await Hotel.findByIdAndDelete(hotelId);
  return { id: hotelId, name: hotel.name };
};
