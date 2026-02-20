
import User from "../models/user.model.js"
import Hotel from "../models/hotel.model.js"
//store wishlist data in wishlist array of the user model

export const addwishlistService=async(userId,hotelId)=>{

    console.log("recieved data in add wishlist service is",userId);
    console.log("recieved data in wishlisr servixe is fofr hotelId",hotelId);
    
    if(!hotelId){
        throw  new Error({message:"Hotel not found"});
    }
    const user=await User.findById(userId);
    console.log("user  data is ",user);

    if(!user){
        throw  new Error({message:"User not found"});
    }
    //check if hotel already presne tin the wishlist 
    
    const userAlreadyHasHotel = await User.exists({
        _id: userId,
        wishlist: { $in: [hotelId] }
    });
    console.log("user already exists result  is ",userAlreadyHasHotel);

    //if present in the wishlist throw the error

    if (userAlreadyHasHotel){
      throw  new Error( {message: "Hotel already in wishlist" });
    }

    //push hotel in wishlist aarray for user 
    console.log("wish list is",user.wishlist);

    user.wishlist.push(hotelId);
    await user.save();

    return {
        wishlist:user.wishlist
    }
}


export const getwishlistservice=async(userId)=>{
    const user=await User.findById(userId);
    if(!user){
        throw new Error("user not found");
    }
    // const wishlistArray = user.wishlist;
    const wishlistArray=await User.findById(userId).populate("wishlist")

    console.log("wishlist is ",wishlistArray.wishlist);
    console.log("user.wishlist is",user.wishlist);
    return wishlistArray.wishlist;


}

export const deletewishlistservice=async(userId,hotelId)=>{

    console.log("Abhi entered in the deletewishlistservice")
    const hotelexists=await Hotel.findById(hotelId);


    if(!hotelexists){
        throw new Error("Hotel not Found");
    }
    const user=await User.findById(userId);


    if(!user){
        throw new Error("User not Found");
    }

    console.log("wishlist befroe abhi delete is",user.wishlist);
    user.wishlist = user.wishlist.filter(id => id.toString() !== hotelId);

    console.log("wishlist after abhi deleted it",user.wishlist);

    await user.save();
    
    return user.wishlist;


}