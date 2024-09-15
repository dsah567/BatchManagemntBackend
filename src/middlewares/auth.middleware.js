import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {

  const token = req.cookies.jwt_token;  

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded =await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {

    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};
