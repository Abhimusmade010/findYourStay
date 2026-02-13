import hotelModel from "../models/hotel.model.js";
import { fetchHotels,searchForHotel,fetchHotel,addHotel,modifyHotel,adminHotels} from "../services/hotel.service.js"

export const getAllHotels = async (req, res) => {

  try {
    // const data = req.body;
    const result = await fetchHotels();
    console.log("inside getall hotels",result);
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
    console.log("Data from the searchh Hotel",data);
    const myhotels=await searchForHotel(data);
    console.log("Data from teh serahcing ",myhotels);
    res.status(200).json(myhotels);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }

}

export const getoneHotel=async (req,res)=>{
  try{
    const data=req.params.id;
    const result=await fetchHotel(data);
    res.status(200).json({
      message:"Hotels",
      result
    })
  }catch(error){
    res.status(400).json({
      error:error.message
    })
  }
}

export const createHotel=async(req,res)=>{
  
  try{
    console.log("Request body is:",req.body);
    console.log("request is",req)

    const data=req.body;
    const userID=req.user._id;
    console.log("data in controller is:",data);

    const result=await addHotel(data,userID);
    console.log("result is controller is:",result);
    res.status(200).json({
      message:"Hotel created successfully",
      data:result
    })
  }
  catch(error){
    res.status(500).json({
      success:false,
      error:error.message
    })
  }
}

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
    console.log("USer id from getmyHotels controller",userId);

    const result =await adminHotels(userId);
    console.log("Result after service is:",result);
    
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