const jwt = require("jsonwebtoken");

const adminlogin = (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "secret123");
      req.user = decoded;
      next();
    } catch(error) {
      return res.status(401).json({ message: "Unauthorized token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized token" });
  }
};

const baseCommanderLogin = (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "secret123");
      req.user = decoded;
      next();
    } catch(error) {
      return res.status(401).json({ message: "Unauthorized token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized token" });
  }
};

module.exports = { adminlogin, baseCommanderLogin };
