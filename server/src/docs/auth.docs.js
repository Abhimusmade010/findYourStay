export const authDocs = {
  "/auth/register": {
    post: {
      summary: "Register user",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "User registered" },
        400: { description: "Validation error" }
      }
    }
  },

  "/auth/login": {
    post: {
      summary: "Login user",
      tags: ["Auth"],
      responses: {
        200: { description: "Login successful" }
      }
    }
  }
};