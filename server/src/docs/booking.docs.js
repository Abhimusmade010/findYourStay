export const bookingDocs = {
  "/bookings": {
    post: {
      summary: "Create booking",
      tags: ["Bookings"],
      security: [{ bearerAuth: [] }],
      responses: {
        201: { description: "Booking created" }
      }
    }
  },

  "/bookings/history": {
    get: {
      summary: "Get booking history",
      tags: ["Bookings"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Booking history" }
      }
    }
  }
};
