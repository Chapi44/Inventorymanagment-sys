const { isTokenValid } = require("../utils");


const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    return res.status(401).json({ error: "Authentication Invalid" });
  }

  try {
    const { full_name, userId, role, api_permission } = isTokenValid({ token });
    req.user = { full_name, userId, role, api_permission };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication Invalid" });
  }
};


const authorizePermissions= (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Unauthorized to access this route " });
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
 
};
