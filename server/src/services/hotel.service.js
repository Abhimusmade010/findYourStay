// import dotenv from "dotenv";
// dotenv.config();

import Hotel from "../models/hotel.model.js"

export const fetchHotels=async()=>{
    
    const hotels=await Hotel.find();
    return{
        hotels
    }

}

export const searchForHotel=async(filters)=>{
    const query={};
    // q is the search term that the user will enter in the search bar, it can be the name of the hotel, city, state or description of the hotel
    //this check is the q exists or not if it exists then we will search for the hotel based on the name, city, state and description of the hotel
    if(filters.q){
        const regex=new RegExp(filters.q,'i');  //i for case insensitive search
        query.$or=[
            {name:regex},
            {"location.city":regex},
            {"location.state":regex},
            {description:regex}
        ];
    }
    //exact location search based on city, state and country
    if(filters.city){
        query["location.city"]=new RegExp(filters.city,'i');
    }
    // if the state is provided in the filters then we will search for the hotel based on the state
    if(filters.state){
        query["location.state"]=new RegExp(filters.state,'i');
    }   
    // if the country is provided in the filters then we will search for the hotel based on the country
    if(filters.country){
        query["location.country"]=new RegExp(filters.country,'i');

    }
    //price range search based on minPrice and maxPrice
    if(filters.minPrice || filters.maxPrice){
        query.pricePerNight={};
        if(filters.minPrice){
            query.pricePerNight.$gte=Number(filters.minPrice);
        }
        if(filters.maxPrice){
            query.pricePerNight.$lte=Number(filters.maxPrice);
        }
    }

    //amenities for search  
    //filters.amenities is an array of amenities that the user will select from the search filters, 
    // we will search for the hotels that have all the amenities selected by the user
    if(filters.amenities?.length){
        query.amenities={$all:filters.amenities};
    }

    //$all operator is used to match all the elements of the array, 
    // in this case we want to match all the amenities selected by the user with the amenities of the hotel


    //availability
    if(filters.available!==undefined){
        query.availability=filters.available==="true";  //available is a string that we will get from the query parameters, we need to convert it to boolean
    }

    //sorting
    //sortoptions is an object that contains the sorting options for the search results, we will sort the search results 
    // based on the sorting option selected by the user
    //price_asc
    const sortOptions={
        price_asc:{pricePerNight:1},
        price_desc:{pricePerNight:-1},
        newest:{createdAt:-1},
        name:{name:1}
    };
    const sort=sortOptions[filters.sortBy] || {createdAt:-1};  //default sorting by newest

    const hotels=await Hotel.find(query).sort(sort);

    return{
        hotels
    };




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
