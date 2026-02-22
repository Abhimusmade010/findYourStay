
// import { approveBookingService } from "../services/booking.service.js"
import { createBookingService } from "../services/booking.service.js";
import { getmyHotelsPendingBookingService } from "../services/booking.service.js";

export const createBookingcontroller=async (req,res)=>{
    try{
        const { hotelId, checkIn, checkOut } = req.body;
        const customerId=req.user._id;
        console.log("request user is",req.user);
        console.log("in booking controller customer hotelid",hotelId)
        console.log("in booking controller customer checkin",checkIn)
        console.log("in booking controller customer checkOut",checkOut)
        console.log("in booking controller customer ",customerId)


        const booking=await createBookingService({hotelId,checkIn,checkOut,customerId});
        console.log("after returning from the service ",booking);

        res.status(200).json({
            result:booking,
            message:"Booking created successfully.Awaiting admin approval!!",
        })
        
    }catch(error){
        res.status(400).json({
            success:false,
            error: error.message
        })
    }

}

// export const approveBookingController=async(req,res)=>{
//     try{
//         const data=req.body;
//         // controller for the approve booking by the admin for the customer 
//         const result =await approveBookingService(data);
        
//         res.status(200).json({
//             result,
//             message:"successfully confirmed booking by the admin for you!!"
//         })
//     }catch(error){
//         res.status(400).json({
//             success:false,
//             error:error.message
//         })
//     }
// }

export const getmyHotelsPendingBookingController=async(req,res)=>{
    try{
        const userId=req.user._id;
        // const hotelId=req.body;/
        
        const result=await getmyHotelsPendingBookingService(userId);
        console.log("result in csontoller is",result);
        
        res.status(200).json({
            message:"Boookings fetch successfully!!",
            result

        })
    }catch(error){

        res.status(400).json({
            success:false,
            error:error.message
        })

    }

}