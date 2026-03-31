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
        status: "success",
        message: "Hotels fetched from cache",
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

    console.log("inside getall hotels",result);
    res.status(200).json({   //200 because for succes not 201 becuase nothing is creating 
      // status: "success",   
      // message: "Hotels fetched from database",
      result
    });


  } catch (error) {
    res.status(400).json({ 
      status: "error",
      error: error.message 
    });
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

    //no data found for the given location
    if(error.message === "No hotels found for the given location"){
      return res.status(404).json({
        status: "error",
        message: error.message
      });
    }
      res.status(400).json({
        status: "error",
        message: error.message
      }); 


    // res.status(500).json({ message: error.message });
  }

}

export const getoneHotel=async (req,res)=>{
  try{
    const data=req.params.id;

    const hotel=await fetchHotel(data);

    // console.log("Hiotels details is",hotel);


    res.status(200).json({
      status: "success",
      message:"Hotels",
      hotel
    })
  }catch(error){

    //no hotel found for the given id
    if(error.message === "No Hotel Found"){
      return res.status(404).json({
        status: "error",
        message: error.message
      });
    }
    res.status(400).json({
      status: "error",
      message: error.message
    }); 

  }
}

import { uploadToCloudinary } from "../utils/uploadService.js";

export const createHotel = async (req, res) => {
  try {
    // const data = req.body;
    const userID = req.user._id;
    const data = { ...req.body};



    const formattedData = {
      name: data.name,
      description: data.description,
      pricePerNight: Number(data.pricePerNight),
      amenities: data.amenities,
      location: {
        city: data.city,
        state: data.state,
        country: data.country,
        address: data.address
      }
    };

// const result = await addHotel(formattedData, userID);
    // console.log("ine the controller")
    // console.log("data is ",data);
    // console.log("userID is",userID);
    // console.log("req.files is:",req.files);

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
    formattedData.images = imageUrls;
    console.log("data after attaching images is:",formattedData);
    const result = await addHotel(formattedData, userID);

    console.log("result from service is:",result);
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

    const result=await modifyHotel(id,data,userID);

    res.status(200).json({
      success: true,
      message: "Hotel updated successfully!",
      data: result
    });

  }
  catch(error){

    if(error.message === "Hotel not found"){
      return res.status(404).json({
        success: false,
        message: error.message
      });
    } 

    //logged in but not authorized user to update the hotel details and 401 not logged in user
    if(error.message === "You are not authorized to update this hotel"){
      return res.status(403).json({
        success: false,
        message: error.message
      });
    } 

     res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

export const getMyHotels=async(req,res)=>{
  try{
    const userId=req.user._id;

    const result =await adminHotels(userId);
    
    res.status(200).json({
      success:true,
      message:"Hotel fetched for admin",
      result
    })

    
  }catch(error){

    if(error.message === "UserID is required"){
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
}
