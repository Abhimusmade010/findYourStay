// const cloudinary = require("../config/cloudinary");
// import { cloudinaryConfig } from "../config/cloudinary.js";
import streamifier from "streamifier";
import { cloudinary } from "../config/cloudinary.js";

// export const uploadToCloudinary = (buffer) => {
//   console.log("in the uploadToCloudinary function");
//     return new Promise((resolve, reject) => {
//         let stream = cloudinaryConfig.uploader.upload_stream(
//             {
//                 folder: "demo_uploads"
//             },
//             (error, result) => {
//                 if (error) return reject(error);
//                 resolve(result.secure_url);
//             }
//         );

//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

export const uploadToCloudinary = (buffer) => {
    console.log("in the uploadToCloudinary function");
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "demo_uploads" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        console.log("Cloudinary upload result:", result);
        resolve({
          url: result.secure_url
        });

        //later store the public_id in the database for deleting the image from cloudinary when hotel is deleted or image is updated
       // resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};



