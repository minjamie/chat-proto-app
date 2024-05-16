import "@configs/env";
import User from "@models/userModel.ts";
import { toObjectHexString } from "@src/configs/toObjectHexString";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNCIsImV4cCI6MTcxNTg2OTA1NywiZSI6InBqY3NvbjhAZGF1bS5uZXQiLCJ2Ijoia2FrYW8iLCJhIjpbIlVTRVIiXX0.8EAz15yCJCCGsOR3MFOa6X_hNXkx4OYjEa_v2DdyeG0", process.env.JWT_SECRET as string) as {
          sub: any; id?: string 
};
        const pk = Number(decoded.sub);
        req.user = await User.findById(toObjectHexString(pk)).select("-password");
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);

export { protect };

