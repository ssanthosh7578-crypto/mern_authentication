import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
const verification = (req, res, next) => {
  // Accept token from cookie, Authorization header, or body.token
  const cookieToken = req.cookies?.token;
  const header = req.headers?.authorization;
  const headerToken = header && header.startsWith('Bearer ') ? header.split(' ')[1] : undefined;
  const bodyToken = req.body?.token;

  const token = cookieToken || headerToken || bodyToken;

  if (!token) {
    return res.status(401).json({ message: 'Please register or login' });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = tokenDecode.id || tokenDecode._id || tokenDecode.userId;
    next();
  } catch (error) {
    console.error('JWT ERROR:', error.message || error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default verification;