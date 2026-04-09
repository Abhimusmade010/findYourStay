
import { createReviewService, getReviewsByHotelService } from "../services/review.service.js";

export const addReviewController = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { hotelId, rating, comment } = req.body;

    // if (!hotelId) throw new Error("hotelId is required");

    const result = await createReviewService({
      hotelId,
      customerId,
      rating,
      comment: comment.trim(),
    });

    return res.status(201).json({
      status: "success",

      message: "Review added successfully",
      result
     });
  } 

  catch (error) {
    //hotel not found for the given hotelId error so not found status code is 404
    if (error.message === "Hotel not found") {
      return res.status(404).json({
        status: "error",
        message: error.message,
      });
    }
    
    //rating must be a number between 1 and 5 error so bad request status code is 400
    if(error.message==="rating must be a number between 1 and 5"){
      return res.status(400).json({
        status: "error",  
        message: error.message,
      });
    }

    //comment is required error so bad request status code is 400
    if(error.message==="comment is required"){
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    } 

    //after stay complete condition for review is not met so forbidden status code is 403
    if(error.message==="You can review only after completing a confirmed stay"){
      return res.status(403).json({
        status: "error",
        message: error.message,
      });
    }

    
    return res.status(400).json({
      status: "error",
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

