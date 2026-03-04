
import { approveBookingService } from "../services/booking.service.js"
import { createBookingService } from "../services/booking.service.js";
import { getmyHotelsPendingBookingService } from "../services/booking.service.js";
// import { getConfirmedBookingService } from "../services/booking.service.js";
import { getConfirmedBookingService } from "../services/booking.service.js";
import { getActiveBookingsForCustomerService } from "../services/booking.service.js";
import { getBookingHistoryForCustomerService } from "../services/booking.service.js";
import { denyBookingService } from "../services/booking.service.js";


export const createBookingcontroller=async (req,res)=>{


    try{
        const { hotelId, checkIn, checkOut } = req.body;
        const customerId=req.user._id;
        // console.log("request user is",req.user);
        // console.log("in booking controller customer hotelid",hotelId)
        // console.log("in booking controller customer checkin",checkIn)
        // console.log("in booking controller customer checkOut",checkOut)
        // console.log("in booking controller customer ",customerId)


        const booking=await createBookingService({hotelId,checkIn,checkOut,customerId});
        // console.log("after returning from the service ",booking);

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

export const getMyConfirmedBookingsController=async(req,res)=>{
    try{
        // const {bookingId}=req.body;

        const userId=req.user._id;
        // console.log("in getConfirmedBookingController booking id",bookingId)
        console.log("in getConfirmedBookingController user ID",userId)
        // const result=await approveBookingService(userId.bookingId);
        const result=await getConfirmedBookingService(userId);

        res.status(200).json({
            result,
            message:"successfully added confirmed booking by the admin!!"
        })
    }catch(error){
        res.status(400).json({
            success:false,
            error:error.message
        })
    }
}

export const approveBookingController=async(req,res)=>{

    try{
        // console.log("entry in approveBookingController")
        const {bookingId}=req.body;
        const userId=req.user._id;
        // controller for the approve booking by the admin for the customer 
        console.log("data from the req.,body is ",bookingId);
        const result =await approveBookingService(userId,bookingId);
        res.status(200).json({
            result,
            message:"successfully confirmed booking by the admin for you!!"
        })
    }catch(error){
        res.status(400).json({
            success:false,
            error:error.message
        })
    }
}

export const getmyHotelsPendingBookingController=async(req,res)=>{
    try{
        console.log("in getmy Hotels Pending Booking Controller")
        const userId=req.user._id;

        // const hotelId=req.body;/
        
        const result=await getmyHotelsPendingBookingService(userId);
        console.log("result in contoller is",result);
        
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

// export const getConfirmedBookingController=async(req,res)=>{
//     try{
//         const data=req.body;
    
//         //i want to get the bookings that are confirmed by the admin 
        
//     }
//     catch(error){

//     }
// }

export const getActiveBookingsForCustomerController = async (req, res) => {
  try {
    const customerId = req.user._id;
    const result = await getActiveBookingsForCustomerService(customerId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookingHistoryForCustomerController = async (req, res) => {
  try {
    const customerId = req.user._id;
    const result = await getBookingHistoryForCustomerService(customerId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const denyBookingController = async (req, res) => {
  try {
    const adminUserId = req.user._id;
    const bookingId = req.params.id;

    const result = await denyBookingService(adminUserId, bookingId);
    return res.status(200).json({
      result,
      message: "Booking denied",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};