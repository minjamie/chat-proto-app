import jwt from "jsonwebtoken";
import "./env";

const generateToken = (id: any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

export default generateToken;