const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Ensure the "authorization" header exists
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return res.status(401).send({
        message: "Authorization header missing",
        success: false,
      });
    }

    const token = authorizationHeader.split(' ')[1]; // Ensure there’s a token
    if (!token) {
      return res.status(401).send({
        message: "Token missing in authorization header",
        success: false,
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Invalid or expired token",
          success: false,
        });
      }

      req.body.userId = decoded.id; // Assuming `decoded.id` contains the user ID
      next(); // Proceed to the next middleware or route handler
    });

  } catch (error) {
    return res.status(500).send({
      message: "An error occurred during authorization",
      success: false,
    });
  }
};
