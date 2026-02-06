import { registerUser, logUser } from "../services/auth.service.js";

const signUpUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await registerUser(data);

    res.status(201).json({
      message: "User created successfully",
      result
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await logUser(data);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { signUpUser, loginUser };
