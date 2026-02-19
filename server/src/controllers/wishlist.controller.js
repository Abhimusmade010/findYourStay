// import express from 'express'
import { addwishlistService } from '../services/wishlist.service.js'

export const addToWishlistcontroller=async(req,res)=>{
    try{
        const userId=req.user._id;
        const {hotelId} =req.body;
        console.log("insdie controller of addwishlkist userId is ",userId)
        console.log("insdie controller of addwishlist hotelId is ",hotelId);

        const result=await addwishlistService(userId,hotelId);
        console.log("result ins controller is ",result);

        res.status(200).json({
            message:"Added to wishlist successfully",
            result
        })    
    }


    catch(error){
        res.status(400).json({
            success:false,
            error:error.message
        })
    }

}
