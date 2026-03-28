// const multer = require("multer");
import multer from "multer";

//  define storage again

const storage = multer.memoryStorage();

export const upload = multer({
  storage,

  limits: {
    fileSize: 2 * 1024 * 1024       
  },

  fileFilter: (req, file, cb) => {

    if(file.mimetype.startsWith("image/")) {

      cb(null, true);
    } 
    else{
      cb(new Error("Only image files are allowed"), false);

    }
  }
});

// module.exports = upload;