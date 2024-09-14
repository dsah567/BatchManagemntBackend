import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt_token;  

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("user decoded");
    next();
  } catch (error) {
    console.log("Token is invalid or expired");
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};
