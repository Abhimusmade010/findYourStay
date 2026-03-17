

export const validate = (schema) => async (req, res, next) => {

  try{
    console.log("in the validate function");

    await schema.parseAsync({
      body: req.body
    });
    console.log("before next");
    
    next();
  } 
  catch (error){

    return res.status(400).json({
      message: "Validation failed",
      errors: error.errors

    });

  }
  
};

