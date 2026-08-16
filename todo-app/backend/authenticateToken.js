import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      error: "Nicht authentifiziert"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      error: "Ungültiges oder abgelaufenes Token"
    });
  }
}

export default authenticateToken;