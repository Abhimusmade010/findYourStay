import { authDocs } from "../docs/auth.docs.js";
import { hotelDocs } from "../docs/hotel.docs.js";
import { bookingDocs } from "../docs/booking.docs.js";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "FindYourStay API",
    version: "1.0.0"
  },
  servers: [
    { url: "http://localhost:3001/api" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer"
      }
    }
  },
  paths: {
    ...authDocs,
    ...hotelDocs,
    ...bookingDocs
  }
};