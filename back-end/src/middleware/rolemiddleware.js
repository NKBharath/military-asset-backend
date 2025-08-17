const adminonly = (req, res, next) => {
  if(req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Need Security Clearance" });
  }
}

const baseCommanderOnly = (req, res, next) => {
  if(req.user && req.user.role === "base_commander") {
    next();
  } else {
    return res.status(403).json({ message: "Need Security Clearance" });
  }
}

module.exports = { adminonly, baseCommanderOnly };
