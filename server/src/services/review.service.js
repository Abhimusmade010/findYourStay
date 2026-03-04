import Booking from "../models/booking.model.js";
import Hotel from "../models/hotel.model.js";
import Review from "../models/review.model.js";

export const createReviewService = async ({ hotelId, customerId, rating, comment }) => {
  const hotelExists = await Hotel.exists({ _id: hotelId });
  if (!hotelExists) throw new Error("Hotel not found");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasPastConfirmedBooking = await Booking.exists({
    customer: customerId,
    hotel: hotelId,
    status: "Confirmed",
    checkOut: { $lt: today },
  });

  if (!hasPastConfirmedBooking) {
    throw new Error("You can review only after completing a confirmed stay");
  }

  try {
    const review = await Review.create({
      hotel: hotelId,
      customer: customerId,
      rating,
      comment,
    });

    return await review.populate("customer", "name email");
  } catch (e) {
    // Duplicate key error from the unique index (hotel + customer)
    if (e?.code === 11000) {
      throw new Error("You have already reviewed this hotel");
    }
    throw e;
  }
};

export const getReviewsByHotelService = async (hotelId) => {
  // We populate the customer basic fields because UI displays reviewer name.
  return await Review.find({ hotel: hotelId })
    .populate("customer", "name email")
    .sort({ createdAt: -1 });
};