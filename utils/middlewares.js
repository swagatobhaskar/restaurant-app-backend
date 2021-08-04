const { handleRefreshToken } = require('./jwtTokens');

const authMiddleware = (req, res, next) => {
    if (req.baseUrl === '/login') next();
    console.log("URL: ", req.baseUrl);

    const token = req.cookies.token;
    if (!token) return res.status(401).send("Access Denied");
    
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            //return res.sendStatus(403);
            handleRefreshToken()
        }
        req.user = user;
        next();
    });
};


module.exports = authMiddleware;