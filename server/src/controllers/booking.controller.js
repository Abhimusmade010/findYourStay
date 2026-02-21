
import { createBookingService } from "../services/booking.service.js"

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

