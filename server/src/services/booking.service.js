import Booking from "../models/booking.model.js";
import Hotel from "../models/hotel.model.js";
import User from "../models/user.model.js"
import {normalizeDate,validateDateRange,buildDateRangeArray} from "../utils/date.util.js";
import { createNotification } from "./notification.service.js";

const PENDING_BOOKING_EXPIRY_MINUTES = Number(process.env.PENDING_BOOKING_EXPIRY_MINUTES || 30);

const buildPendingExpiryDate = () => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + PENDING_BOOKING_EXPIRY_MINUTES);
  return expiresAt;
};

const recalculateHotelAvailability = (hotel) => {
  hotel.availability = hotel.bookedDates.length === 0;
};

const removeBookedDateRangeFromHotel = (hotel, checkIn, checkOut) => {
  const bookingDates = buildDateRangeArray(checkIn, checkOut).map((date) => normalizeDate(date).getTime());

  hotel.bookedDates = hotel.bookedDates.filter((range) => {
    if (!Array.isArray(range) || range.length !== bookingDates.length) {
      return true;
    }

    const normalizedRange = range.map((date) => normalizeDate(date).getTime());
    return !normalizedRange.every((value, index) => value === bookingDates[index]);
  });

  recalculateHotelAvailability(hotel);
};


export const getActiveBookingsForCustomerService = async (customerId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // "Active & Upcoming" = bookings that haven't ended yet.
  // Includes Pending (waiting for admin approval) and Confirmed.
  return await Booking.find({
    customer: customerId,
    status: { $in: ["Pending", "Confirmed"] },
    checkOut: { $gte: today },
  })
    .populate("hotel")
    .sort({ checkIn: 1 });
};


export const getConfirmedBookingService = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hotels = await Hotel.find({ createdBy: userId });
  const hotelIds = hotels.map(hotel => hotel._id);

  // Only upcoming confirmed bookings
  const confirmedBookings = await Booking.find({
    hotel: { $in: hotelIds },
    status: "Confirmed",
    checkOut: { $gte: today }
  }).populate("hotel customer");

  return confirmedBookings;
}


export const createBookingService = async ({hotelId,checkIn,checkOut,customerId}) => {

  // 1️⃣ Find hotel
  // console.log("customer id is ",customerId)
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    throw new Error("Hotel not found");
  }
  // console.log("in booking service",hotel);

  // 2️⃣ Normalize dates
  const checkInDate = normalizeDate(checkIn);
  const checkOutDate = normalizeDate(checkOut);

  // console.log("chechIn dates",checkInDate)
  // console.log("check out dates",checkOutDate)
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
  // console.log("total nights",nights)
  // console.log("totalPrice",totalPrice);

  // 5️⃣ Create booking (Pending)
  const booking = await Booking.create({
    customer: customerId,
    hotel: hotelId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice,
    status: "Pending",
    expiresAt: buildPendingExpiryDate(),
  });


  // console.log("final boking is ",booking);
  //if bookking is done then remove this hotel from the wish list of the user 
  // we have booklist array field in user schema 
  

  // check first if the hotel user is booking is present in the wishlist if present remove it 
  // const hotelWishListArray=User.wishlist
  
  // 6️⃣ Send notifications
  try {
    // Notify Hotel Admin
    const adminMsg = `New booking request for "${hotel.name}" from ${booking.checkIn.toDateString()} to ${booking.checkOut.toDateString()}. Awaiting your approval.`;
    await createNotification(hotel.createdBy, adminMsg);

    // Notify Customer
    const customerMsg = `Your booking request for "${hotel.name}" (${booking.checkIn.toDateString()} - ${booking.checkOut.toDateString()}) has been sent. You will be notified once the admin reviews it.`;
    await createNotification(customerId, customerMsg);
  } catch (e) { 
    console.error("Failed to create booking notifications", e.message);
  }


  await User.findByIdAndUpdate(
    customerId,
    {
      $pull: { wishlist: hotelId }
    },
    { new: true }
  );
  
  return booking;
};

export const  approveBookingService=async(userId,bookingId)=>{
   console.log("in approveBookingService")
  // console.log("booking Id is ",bookingId);
  const booking = await Booking.findById(bookingId).populate("hotel");
  if(!booking){
    throw new Error("Booking not found")
  }
  if(booking.status!="Pending"){
    throw new Error("Only pending bookings can be approved")
  }
  if (String(booking.hotel.createdBy) !== String(userId)){
    throw new Error("Not authorized to approve this booking")
  }
  
  // console.log("hotel id in booking is",booking.hotel._id)
  // const hotel= await Hotel.findbyId(booking.hotel)
  const hotel = booking.hotel;
  const dateRange = buildDateRangeArray(booking.checkIn, booking.checkOut);

  const overlaps = hotel.bookedDates.some(range => {
      if (!Array.isArray(range) || range.length === 0) return false;
      const existingStart = new Date(range[0]).setHours(0,0,0,0);
      const existingEndExclusive = new Date(range[range.length - 1]);
      existingEndExclusive.setHours(0,0,0,0);
      existingEndExclusive.setDate(existingEndExclusive.getDate() + 1); // make it exclusive for comparison

      const newStart = new Date(dateRange[0]).setHours(0,0,0,0);
      const newEndExclusive = new Date(dateRange[dateRange.length - 1] || dateRange[0]);
      newEndExclusive.setHours(0,0,0,0);
      newEndExclusive.setDate(newEndExclusive.getDate() + 1);

      // intervals [start, end) overlap if start < otherEnd && otherStart < end
      return (newStart < existingEndExclusive) && (existingStart < newEndExclusive);
  });
  if(overlaps){
    throw new Error("Selected dates overlap an existing booking")
  }

    hotel.bookedDates.push(dateRange);
    hotel.availability = false;
    recalculateHotelAvailability(hotel);
    await hotel.save();
    booking.status = "Confirmed";
    booking.expiresAt = null;
    await booking.save();

    //now if user has added the hotel in wishlist first and booked and booking in approved then it should removed from the wishlist 

     try {
      const msg = `✅ Your booking at "${hotel.name}" (${booking.checkIn.toDateString()} - ${booking.checkOut.toDateString()}) has been CONFIRMED by the admin! Enjoy your stay.`;
      await createNotification(booking.customer, msg);
    } catch (e) {
      console.error("Failed to create approval notification", e.message);
    }

    return {booking,hotel}

}


export const getmyHotelsPendingBookingService=async(userId)=>{

  //get all bookings for the hotel 
  console.log("in the getmyHotels Pending BookingController")

  const hotel=await Hotel.find({createdBy:userId});
  // console.log("hotel crteated by admin is ",hotel);
  
  if (!hotel.length) {
    return [];
  }
  //hotel id extracted

  const hotelIds = hotel.map(hotel => hotel._id);

  // const hotelId=hotel._id;
  // console.log("hotel id is",hotelIds);
  

  const bookings = await Booking.find({
    hotel: { $in: hotelIds },
    status: "Pending"
  }).populate("customer hotel");

  
  // console.log("Bookings data is ",bookings);

  return bookings;


}


export const getBookingHistoryForCustomerService = async (customerId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // "History" = anything ended in the past OR explicitly cancelled/completed.
  return await Booking.find({
    customer: customerId,
    $or: [
      { checkOut: { $lt: today } },
      { status: { $in: ["Cancelled", "Completed", "Expired"] } },
    ],
  })
    .populate("hotel")
    .sort({ checkIn: -1 });
};

export const getAdminBookingHistoryService = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hotels = await Hotel.find({ createdBy: userId });
  const hotelIds = hotels.map(hotel => hotel._id);

  // History for Admin = past bookings OR cancelled/expired bookings
  return await Booking.find({
    hotel: { $in: hotelIds },
    $or: [
      { checkOut: { $lt: today } },
      { status: { $in: ["Cancelled", "Completed", "Expired"] } }
    ]
  }).populate("hotel customer").sort({ checkIn: -1 });
};

export const denyBookingService = async (adminUserId, bookingId) => {
  const booking = await Booking.findById(bookingId).populate("hotel");
  if (!booking) throw new Error("Booking not found");

  if (booking.status !== "Pending") {
    throw new Error("Only pending bookings can be denied");
  }

  if (String(booking.hotel.createdBy) !== String(adminUserId)) {
    throw new Error("Not authorized to deny this booking");
  }

  booking.status = "Cancelled";
  //changes made 
  booking.cancelledAt = new Date();
  booking.cancellationReason = "Denied by admin";
  booking.expiresAt = null;
  await booking.save();

  try {
    const msg = `❌ Your booking at "${booking.hotel?.name}" (${booking.checkIn.toDateString()} - ${booking.checkOut.toDateString()}) was denied by the admin.`;
    await createNotification(booking.customer, msg);
  } catch (e) {
    console.error("Failed to create denial notification", e.message);
  }

  return booking;
};


export const cancelBookingService = async (customerId, bookingId) => {

  const booking = await Booking.findById(bookingId).populate("hotel");
  if (!booking) {
    throw new Error("Booking not found");
  }

  if (String(booking.customer) !== String(customerId)) {
    throw new Error("Not authorized to cancel this booking");
  }

  if (!["Pending", "Confirmed"].includes(booking.status)) {
    throw new Error("Only pending or confirmed bookings can be cancelled");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (booking.status === "Confirmed" && booking.checkIn <= today) {
    throw new Error("Started bookings cannot be cancelled");
  }

  if (booking.status === "Confirmed") {
    removeBookedDateRangeFromHotel(booking.hotel, booking.checkIn, booking.checkOut);
    await booking.hotel.save();
  }

  booking.status = "Cancelled";
  booking.cancelledAt = new Date();
  booking.cancellationReason = "Cancelled by customer";
  booking.expiresAt = null;
  await booking.save();

  return booking;
};

export const expirePendingBookingsService = async () => {
  const now = new Date();

  const expiredBookings = await Booking.find({
    status: "Pending",
    expiresAt: { $ne: null, $lte: now },
  }).populate("hotel");

  if (!expiredBookings.length) {
    return { expiredCount: 0 };
  }

  for (const booking of expiredBookings) {
    booking.status = "Expired";
    booking.cancelledAt = now;
    booking.cancellationReason = "Booking request expired before admin approval";
    booking.expiresAt = null;
    await booking.save();

    try {
      const msg = `Your booking at ${booking.hotel?.name} from ${booking.checkIn.toDateString()} to ${booking.checkOut.toDateString()} expired because no admin action was taken in time.`;
      await createNotification(booking.customer, msg);
    } catch (error) {
      console.error("Failed to create expiry notification", error.message);
    }
  }

  return { expiredCount: expiredBookings.length };
};