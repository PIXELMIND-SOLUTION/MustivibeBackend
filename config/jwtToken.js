import jwt from "jsonwebtoken";

export const generateToken = (mobile) => {
    return jwt.sign(
        { mobile },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
};
