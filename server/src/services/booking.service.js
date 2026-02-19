import Booking from "../models/booking.model.js";
import Hotel from "../models/hotel.model.js";
// import User from "../models/user.model"

import {normalizeDate,validateDateRange,buildDateRangeArray} from "../utils/date.util.js";

export const createBookingService = async ({hotelId,checkIn,checkOut,customerId}) => {

  // 1️⃣ Find hotel
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
