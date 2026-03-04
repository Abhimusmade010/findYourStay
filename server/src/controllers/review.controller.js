import { createReviewService, getReviewsByHotelService } from "../services/review.service.js";


export const addReviewController = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { hotelId, rating, comment } = req.body;

    if (!hotelId) throw new Error("hotelId is required");
    const parsedRating = Number(rating);
    if (!Number.isFinite(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      throw new Error("rating must be a number between 1 and 5");
    }
    if (!comment || typeof comment !== "string" || !comment.trim()) {
      throw new Error("comment is required");
    }

    const result = await createReviewService({
      hotelId,
      customerId,
      rating: parsedRating,
      comment: comment.trim(),
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getReviewsByHotelController = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const result = await getReviewsByHotelService(hotelId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

