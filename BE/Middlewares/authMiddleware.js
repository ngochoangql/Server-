// middlewares/authMiddleware.js

const isAuthenticated = (req, res, next) => {
    // Simulate authentication logic
    const isLoggedIn = false; // Replace with actual authentication check
    if (isLoggedIn) {
      next(); // Cho phép tiếp tục xử lý
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
  
  module.exports = isAuthenticated;
  