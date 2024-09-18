import { Request, Response } from "express";
interface CustomRequest extends Request {
    user?: any; // Adjust the type according to your needs
}
const isAdmin = async (req: CustomRequest, res: Response, next: any) => {
    try {
        const { role } = req.user;
        if (role !== "admin") {
            return res
                .status(401)
                .json({ message: "You are not allowed to access" });
        }
        next();
    } catch (err) {
        next(err); // Pass the error to the error-handling middleware
    }
};

module.exports = {
    isAdmin,
};
