import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  userId?: string;
}
const passToken = process.env.passwordToken || '';
export async function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const tokenByUser = req.headers.authorization || "";
  const token = tokenByUser.split(" ").pop();
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: "No se ha aportado ningún Token",
    });
  }
  try {
    const decoded: any = jwt.verify(token, passToken) as {rol: string, id: string};
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      auth: false,
      message: "Token inválido",
    });
  }
}

export default verifyToken;