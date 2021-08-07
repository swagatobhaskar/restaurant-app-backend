const jwt = require('jsonwebtoken');

const { renewAccessToken } = require('./jwtGen');

const excludedPaths = [
    '/api/users/login/',
    '/api/users/signup/',
    '/api/users/signup',
    '/api/roles/',
]

function authJWTMiddleware(req, res, next) {
    if (excludedPaths.includes(req.path)) {
        console.log(req.path);
        next();

    } else {
        
        const accessToken = req.cookies.access;
        const refreshToken = req.cookies.refresh;

        if (!accessToken) return res.status(401).send("Access token not found!!");

        jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, (err, user) => {
            if (err) {
                const newAccessToken = renewAccessToken(refreshToken);
                // add this new access token to the request cookie
                res.cookie('access', newAccessToken, {maxAge: 3600*1000, httpOnly: true, sameSite: 'lax'}) // secure: true, 
            }
            req.user = user;
            next();
        });
    }
};

module.exports = authJWTMiddleware;
