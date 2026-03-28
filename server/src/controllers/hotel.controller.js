// import hotelModel from "../models/hotel.model.js";
import { fetchHotels,searchForHotel,fetchHotel,addHotel,modifyHotel,adminHotels} from "../services/hotel.service.js"
import { redisClient } from "../config/redis.js";


export const getAllHotels = async (req, res) => {

  try {

    const cacheKey="all_hotels";
    const getCacheData=await redisClient.get(cacheKey);

    if(getCacheData){
      // console.log("Data from the redis fetched")
      return res.status(200).json({
        // message: "Hotels fetched (from cache)",
        result: JSON.parse(getCachedData)
      })
    }
    
    // await redisClient.del("all_hotels");
    //if not in redis ftecht from  mongoDB and store in redis for further fetching
    const result=await fetchHotels();
    await redisClient.set(cacheKey,JSON.stringify(result),{
      EX:60

    }) 
    // console.log("Data strored in cache(redis)");

    // console.log("inside getall hotels",result);
    res.status(200).json({                 //200 because for succes not 201 becuase nothing is creating 
      message: "Hotels fetched",
      result
    });


  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};

export const searchHotel=async(req,res)=>{

  try{
    const data= req.body;
    // console.log("Data from the searchh Hotel",data);
    const myhotels=await searchForHotel(data);
    // console.log("Data from teh serahcing ",myhotels);
    res.status(200).json(myhotels);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }

}

export const getoneHotel=async (req,res)=>{
  try{
    const data=req.params.id;
    console.log("in getoneHotel",data);

    const hotel=await fetchHotel(data);

    // console.log("Hiotels details is",hotel);


    res.status(200).json({
      message:"Hotels",
      hotel
    })
  }catch(error){
    res.status(400).json({
      error:error.message
    })
  }
}

import { uploadToCloudinary } from "../utils/uploadService.js";

export const createHotel = async (req, res) => {
  try {
    const data = req.body;
    const userID = req.user._id;
    console.log("ine the controller")
    console.log("data is ",data);
    console.log("userID is",userID);
    console.log("req.files is:",req.files);

    // Handle image uploads(max 5 images)

    let imageUrls = [];
    // if (req.files && req.files.length > 0) {
    //   console.log("in the files if loop")
    //   const filesToUpload = req.files.slice(0, 5);
    //   imageUrls = await Promise.all(
    //     filesToUpload.map(async (file) => {
    //       return await uploadToCloudinary(file.buffer);
    //     })
    //   );
    //   console.log("below uploadcloudinary function");
    // }
    if (req.files && req.files.length > 0){

      const uploadPromises = req.files.map(file =>
        uploadToCloudinary(file.buffer)
      );

      imageUrls = await Promise.all(uploadPromises);
    }

    console.log("images url",imageUrls);
    console.log("data with images is:",data);
    // Attach image URLs to data
    data.images = imageUrls;

    const result = await addHotel(data, userID);
    res.status(201).json({
      success: true,
      message: "Hotel created successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// export const deleteHotel=async(req,res)=>{
//   try{
//     const id=req.params.id;
//     const userId=req.user._id;
//     const result=await delHotel(id,userId);
//     console.log("result from controller of delete hotel",result);
//     res.status(200).json({
//       message:"Hotel deleted successfully"
//       // data:
//     })

//   }
//   catch(error){

//   }
// }


export const updateHotelController=async(req,res)=>{
  try{

    const id=req.params.id;
    const data=req.body;
    const userID=req.user._id;

    console.log("id in cotnrolller is:",id)
    console.log("data is controller is:",data);
    console.log("userId",userID);

    const result=await modifyHotel(id,data,userID);

    console.log(":updated reuslt:",result);
    res.status(200).json({
      success: true,
      message: "Hotel updated successfully!",
      data: result
    });

  }catch(error){
     res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export const getMyHotels=async(req,res)=>{
  try{
    const userId=req.user._id;
    // console.log("USer id from getmyHotels controller",userId);

    const result =await adminHotels(userId);
    // console.log("Result after service is:",result);
    
    res.status(200).json({
      success:true,
      message:"Hotel fetched for admin",
      result
    })
    // console.log("Response is:", );
  }catch(error){
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}
