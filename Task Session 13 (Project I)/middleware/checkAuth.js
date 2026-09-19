import jwt from "jsonwebtoken";

export function checkAuth(req, res, next) {
    // get token
    const token = req.cookies.node_api_token

    // verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        
        // failed ---> error
        if(err) {
            return res.status(401).json({ error: "invalid token" });
        }
        
        // success ---> next()
        req.user = decodedUser;
        next();
    });
}