

export const validate = (schema) => async (req, res, next) => {

  try{
    console.log("in the validate function");

    await schema.parseAsync(req.body);
    console.log("before next");
    
    next();
  } 
  catch (error){
    const formattedErrors = error.issues.map(issue => ({
      field: issue.path[0] || "unknown",
      message: issue.message
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors  // Array of { field, message }
    });
  } 
  
};

