const generateToken = require("../utils/generateToken");

// Demo user
const DEMO_USER = {
  _id: "507f1f77bcf86cd799439011",
  name: "Demo User",
  email: "demo@example.com",
  role: "admin",
};

const buildAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken(user._id),
});

const signup = async (req, res, next) => {
  try {
    // For demo, just return the demo user
    return res.status(201).json(buildAuthResponse(DEMO_USER));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // Accept any email/password combination and return demo user
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    return res.status(200).json(buildAuthResponse(DEMO_USER));
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    // Return the demo user
    res.status(200).json(DEMO_USER);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getCurrentUser,
};
