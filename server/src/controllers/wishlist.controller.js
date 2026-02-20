// import express from 'express'
import { addwishlistService } from '../services/wishlist.service.js'
import { getwishlistservice } from '../services/wishlist.service.js';
import { deletewishlistservice } from '../services/wishlist.service.js';
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
export const getwishlistcontroller=async(req,res)=>{

    try{
        const userId=req.user._id;
        console.log("user id is ",userId);

        const result=await getwishlistservice(userId);

        console.log("result in getwishcontroller is",result);

        // console.log("wishlist is in controller is",result.wishlist);
        res.status(200).json({
            result,
            message:"Wishlist fetch successfully"
        })

    }catch(error){
        res.status(400).json({
            success:false,
            error:error.message
        })

    }
}
export const deletewishlistcontroller=async(req,res)=>{
    try{


        const {hotelId}=req.body;
        const userId=req.user._id;
        console.log("hotel id is",hotelId)
        console.log("user id is",userId);

        const result=await deletewishlistservice(userId,hotelId);
        console.log("reuslt afyer deleting the wislist is ",result)
        res.status(200).json({
            result,
            message:"successfully remooved from wishlist"
        })

    }catch(error){
        res.status(400).json({
            success:false,
            error:error.message
        })
    }

}