import jwt from "jsonwebtoken";

export function checkAuth(req, res, next) {
    // get token
    const token = req.cookies.task_token;
    try {
        // verify token
        const isVerified = jwt.verify(token, process.env.JWT_SECRET);
        next();
    
    } catch {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }
};