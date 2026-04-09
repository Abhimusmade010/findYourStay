// import express from 'express'
import { addwishlistService } from '../services/wishlist.service.js'
import { getwishlistservice } from '../services/wishlist.service.js';
import { deletewishlistservice } from '../services/wishlist.service.js';


export const addToWishlistcontroller=async(req,res)=>{
    
    try{
        const userId=req.user._id;
        const {hotelId} =req.body;

        // console.log("insdie controller of addwishlkist userId is ",userId)
        // console.log("insdie controller of addwishlist hotelId is ",hotelId);

        const result=await addwishlistService(userId,hotelId);
        console.log("result ins controller is ",result);

        res.status(200).json({
            status:"success",
            message:"Added to wishlist successfully",
            result
        })    
    }
    catch(error){
        res.status(400).json({
            status:"error",
            message:error.message
        })
    }
}

export const getwishlistcontroller=async(req,res)=>{

    try{
        const userId=req.user._id;
        console.log("user id is ",userId);

        const result=await getwishlistservice(userId);


        res.status(200).json({
            status:"success",   
            message:"Wishlist fetch successfully",
            result
        })
    }catch(error){
        res.status(400).json({
            status:"error",
            message:error.message
        })

    }
}

export const deletewishlistcontroller=async(req,res)=>{
    try{
        const {hotelId}=req.body;
        const userId=req.user._id;
        // console.log("hotel id is",hotelId)
        // console.log("user id is",userId);

        const result=await deletewishlistservice(userId,hotelId);
        // console.log("result after deleting the wislist is ",result)

        res.status(200).json({
            status:"success",
            message:"successfully remooved from wishlist",
            result
        })
    }
    catch(error){
        res.status(400).json({
            status:"error",
            message:error.message
        })
    }
}

