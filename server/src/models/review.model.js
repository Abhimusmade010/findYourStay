import mongoose from "mongoose";

/**
 * Review model
 *
 * Used by frontend:
 * - GET  `/api/reviews/hotel/:hotelId` (list reviews for a hotel)
 * - POST `/api/reviews`              (create a review)
 *
 * Design choice:
 * - One review per (hotel, customer). This keeps UI simple and prevents spam.
 */
const reviewSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ hotel: 1, customer: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);

