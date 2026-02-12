import dotenv from "dotenv";
dotenv.config();

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

export const addHotel=async(data,userID)=>{
    console.log(":welcome to sevrice for addhotel")
    
    console.log("id is ins service",userID)
    console.log("this is addhotel servcie hotelId is",data);

    const newHotel=await Hotel.create({
        ...data,
        createdBy:userID
       
    })
    console.log("this si hotel return from service:",Hotel);

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

    console.log("ID of hotel is ",id);

    const existingHotel = await Hotel.findById(id);
    if (!existingHotel) {
        throw new Error("Hotel not found");
    }
    console.log("existing htoel detials is:",existingHotel);
    console.log("existing hotel created  by is",existingHotel.createdBy.id)
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
  console.log("User id got in adminHotels service:", userId);

  if (!userId) {
    throw new Error("User ID is required");
  }

  const result = await Hotel.find({ createdBy: userId }).populate("createdBy", "name email role");      // optional

  return result;
};
