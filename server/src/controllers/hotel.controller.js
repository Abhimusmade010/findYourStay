import { fetchHotels,searchForHotel} from "../services/hotel.service.js"

export const getAllHotels = async (req, res) => {

  try {
    // const data = req.body;
    const result = await fetchHotels();

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
    const myhotels=await searchForHotel(data);
    res.json(myhotels);
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
  
}

