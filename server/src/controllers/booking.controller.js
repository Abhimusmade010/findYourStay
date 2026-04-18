

import { approveBookingService, createBookingService, getmyHotelsPendingBookingService, getConfirmedBookingService, getActiveBookingsForCustomerService, getBookingHistoryForCustomerService, getAdminBookingHistoryService, denyBookingService, cancelBookingService } from "../services/booking.service.js";


export const cancelBookingController = async (req, res) => {

  try {
    const customerId = req.user._id;
    const bookingId = req.params.id;

    const result = await cancelBookingService(customerId, bookingId);
    return res.status(200).json({
      status: "success",
      message: "Booking cancelled successfully",
      result
    });
  } catch (error) {
    return res.status(400).json({

      status: "error",
      message: error.message,
    });
  }

};

export const createBookingcontroller = async (req, res) => {


  try {
    const { hotelId, checkIn, checkOut } = req.body;
    const customerId = req.user._id;


    const booking = await createBookingService({ hotelId, checkIn, checkOut, customerId });

    res.status(200).json({
      status: "success",
      result: booking,
      message: "Booking created successfully.Awaiting admin approval!!",
    })

  } catch (error) {
    res.status(400).json({

      status: "error",
      error: error.message
    })
  }

}

export const getMyConfirmedBookingsController = async (req, res) => {
  try {
    // const {bookingId}=req.body;

    const userId = req.user._id;
    const result = await getConfirmedBookingService(userId);

    res.status(200).json({
      status: "success",
      message: "successfully added confirmed booking by the admin!!",
      result
    })
  } catch (error) {
    res.status(400).json({
      // success:false,
      status: "error",
      error: error.message
    })
  }
}

export const approveBookingController = async (req, res) => {

  try {
    const { bookingId } = req.body;
    const userId = req.user._id;

    const result = await approveBookingService(userId, bookingId);
    res.status(200).json({
      status: "success",
      message: "successfully confirmed booking by the admin for you!!",
      result
    })
  }
  catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message
    })
  }
}

export const getmyHotelsPendingBookingController = async (req, res) => {
  try {
    console.log("in getmy Hotels Pending Booking Controller")
    const userId = req.user._id;

    // const hotelId=req.body;/

    const result = await getmyHotelsPendingBookingService(userId);
    console.log("result in contoller is", result);

    res.status(200).json({
      status: "success",
      message: "Boookings fetch successfully!!",
      result
    })
  } catch (error) {

    res.status(400).json({
      status: "error",
      error: error.message
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
    return res.status(200).json(
      {
        status: "success",
        message: "Active bookings fetched successfully",
        result: result
      }
    );
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getBookingHistoryForCustomerController = async (req, res) => {
  try {
    const customerId = req.user._id;
    const result = await getBookingHistoryForCustomerService(customerId);
    return res.status(200).json({
      status: "success",
      message: "Booking history fetched successfully",
      result
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
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
      status: "success",
      message: "Booking denied",
      result
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getAdminBookingHistoryController = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await getAdminBookingHistoryService(userId);
    return res.status(200).json({
      status: "success",
      message: "Admin booking history fetched successfully",
      result
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

