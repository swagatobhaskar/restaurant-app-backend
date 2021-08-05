const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshToken');
const { generateAccessToken } = require('./jwtTokens');

const excludedPaths = [
    '/api/users/login/',
    '/api/users/signup/',
]

module.exports = function authJWTMiddleware(err, req, res, next) {

    if (excludedPaths.includes(req.path)) {
        console.log("URL found: ", req.path);
        next();
    }

    // if access token exists, verify it
    // if it's invalid, generate a new one with the refresh token
    // else pass on the request
    const token = req.cookies? access: null;
    console.log("access in cookie:", token);

    if (!token) return res.status(401).send("Access Denied! Access token not found!!");
    
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.log("Access token verified");
            //return res.sendStatus(403);
            const newTokens = handleTokenRegeneration();
            console.log("New tokens: ",newTokens);
        }
        req.user = user;
        next();
    });
};

const handleTokenRegeneration = (req, res) => {
    // get the refresh token from the cookies
    const refreshTokenCookie = req.cookies.refresh;
    console.log("Inside token regeneration ", refreshTokenCookie);
    
    if (!refreshTokenCookie == null){
        try {
            let refreshToken = RefreshToken.findOne({token: refreshTokenCookie});

            if (!refreshToken){
                res.status(403).json({ message: "Refresh token is not in database!" });
                return;
            }

            if (RefreshToken.verifyExpiration(refreshToken)) {
                RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
                
                res.status(403).json({
                    message: "Refresh token was expired. Please make a new signin request",
                  });
                return;
            }

            let newAccessToken = generateAccessToken(refreshToken.user._id);

            return tokens = {
                'access': newAccessToken,
                'refresh': refreshToken.token
            };
            /*
            res.cookie('access', tokens.access, {
                maxAge: 3*1000,
                httpOnly: true,
                sameSite: 'lax',
            });
            res.cookie('refresh', tokens.refresh, {
                maxAge: 24*3600*1000,
                httpOnly: true,
                sameSite: 'lax',
            });
            */
        } catch(err) {
            return res.status(500).send({ message: err });
        }
    } else {
        return res.status(401).send('Refresh Token not Found');
    }
}
