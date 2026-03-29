export const hotelDocs = {
  "/hotels": {
    get: {
      summary: "Get all hotels",
      tags: ["Hotels"],
      responses: {
        200: { description: "List of hotels" }
      }
    },

    post: {
      summary: "Create hotel (Admin only)",
      tags: ["Hotels"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                pricePerNight: { type: "number" },
                city: { type: "string" },
                state: { type: "string" },
                country: { type: "string" },
                address: { type: "string" },
                amenities: {
                  type: "array",
                  items: { type: "string" }
                },
                images: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "binary"
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Hotel created" }
      }
    }
  },

  "/hotels/{id}": {
    get: {
      summary: "Get hotel by ID",
      tags: ["Hotels"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" }
        }
      ],
      responses: {
        200: { description: "Hotel details" }
      }
    }
  }
};