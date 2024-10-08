const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";
interface CustomRequest extends Request {
    user?: any; // Adjust the type according to your needs
}
const verifyToken = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization
                .split(" ")[1]
                .replace(/"/g, "");
            jwt.verify(
                token,
                process.env.JWT_SECRET,
                (err: Error, decoded: any) => {
                    if (err) {
                        return res.status(403).json({
                            data: {
                                status: 403,
                                message: "Token has expired",
                            },
                        });
                    }
                    req.user = decoded;
                    next();
                }
            );
        } catch (err) {
            return res.status(403).json({
                data: {
                    status: 403,
                    message: "You are not allowed to access",
                },
            });
        }
    } else {
        return res.status(403).json({
            data: {
                status: 403,
                message: "You are not allowed to access",
            },
        });
    }
};

module.exports = {
    verifyToken,
};
