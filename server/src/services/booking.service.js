import Booking from "../models/booking.model.js";
import Hotel from "../models/hotel.model.js";
// import User from "../models/user.model"
// import Booking from "../models/booking.model.js"

import {normalizeDate,validateDateRange,buildDateRangeArray} from "../utils/date.util.js";

export const createBookingService = async ({hotelId,checkIn,checkOut,customerId}) => {

  // 1️⃣ Find hotel
  console.log("customer id is ",customerId)
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    throw new Error("Hotel not found");
  }
  console.log("in booking service",hotel);

  // 2️⃣ Normalize dates
  const checkInDate = normalizeDate(checkIn);
  const checkOutDate = normalizeDate(checkOut);

  console.log("chechIn dates",checkInDate)
  console.log("check out dates",checkOutDate)
  if (!checkInDate || !checkOutDate) {
    throw new Error("Invalid dates");
  }

  if (!validateDateRange(checkInDate, checkOutDate)) {
    throw new Error("Check-out must be after check-in");
  }

  // 3️⃣ Check overlapping CONFIRMED bookings


  //if not confirmed by the admin the same hotel same dates will be booked by many users until is fixed by the admin i.e 
  // hotel admin need to approve to one of the customer and others will get notified that booking is not avaialable

  const conflict = await Booking.findOne({
    hotel: hotelId,
    status: "Confirmed",
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
  });


  if (conflict) {
    throw new Error("Selected dates are already booked");
  }

  // 4️⃣ Calculate total price
  const nights = buildDateRangeArray(checkInDate, checkOutDate).length;
  const totalPrice = nights * (hotel.pricePerNight || 0);
  console.log("total nights",nights)
  console.log("totalPrice",totalPrice);

  // 5️⃣ Create booking (Pending)
  const booking = await Booking.create({
    customer: customerId,
    hotel: hotelId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice,
    status: "Pending",
  });
  console.log("final boking is ",booking);
  
  return booking;
};

// export const approveBookingService=async(data)=>{

//   //bookings of sai samadhan hotel will go the admin who created sai samadhan hotel

//   //logic to handle the approve booking from hotel admin to the customer


// }

export const getmyHotelsPendingBookingService=async(userId)=>{

  //get all bookings for the hotel 

  const hotel=await Hotel.find({createdBy:userId});
  console.log("hotel crteated by admin is ",hotel);
  
  if (!hotel.length) {
    return [];
  }
  //hotel id extracted

  const hotelIds = hotel.map(hotel => hotel._id);

  // const hotelId=hotel._id;
  console.log("hotel id is",hotelIds);
  

  const bookings = await Booking.find({
    hotel: { $in: hotelIds },
    status: "Pending"
  }).populate("customer hotel");

  
  console.log("Bookings data is ",bookings);

  return bookings;


}