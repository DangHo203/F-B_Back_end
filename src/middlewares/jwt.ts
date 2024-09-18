const jwt = require("jsonwebtoken");
require("dotenv").config();
const generateToken = (id: Number, role: String) => {
    return jwt.sign({ _id: id, role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

const generateRefreshToken = (id: Number) => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export { generateToken, generateRefreshToken };
