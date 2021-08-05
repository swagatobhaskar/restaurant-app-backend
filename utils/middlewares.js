const { handleTokenRegeneration } = require('./jwtTokens');

const excludedPaths = [
    '/api/users/login/',
    '/api/users/signup/',
]

const authJWTMiddleware = (err, req, res, next) => {
    console.log("PATH:: ",req.path);

    //if (excludedPaths.includes(req.path)) {
    //    console.log("URL found: ", req.path);
    //    next();
    //}

    // if access token exists, verify it
    // if it's invalid, generate a new one with the refresh token
    // else pass on the request
    const token = req.cookies.access;
    if (!token) return res.status(401).send("Access Denied! Access token not found!!");
    
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            //return res.sendStatus(403);
            handleTokenRegeneration()
        }
        req.user = user;
        next();
    });
};


module.exports = authJWTMiddleware;