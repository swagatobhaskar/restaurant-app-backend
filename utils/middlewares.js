const jwt = require('jsonwebtoken');

const { renewAccessToken } = require('./jwtGen');

const excludedPaths = [
    '/api/users/login/',
    '/api/users/signup/',
    '/api/users/signup',
	'/api/menus/',
    '/api/menus',
    '/api/menus/images/all',
	'/api/menus/image/d40b2467bd1e9e322823b423a6b93488.jpg',
	'/api/menus/image/bae590969f605823e15b6425b57d142d.jpg',
	'/api/menus/image/c9b9ba4ce958f5b40f3c1f0e48c6f2d5.png'
]

function authJWTMiddleware(req, res, next) {
    if (excludedPaths.includes(req.path)) {
        //console.log(req.path);
        next();

    } else {
        
        const accessToken = req.cookies.access;
        const refreshToken = req.cookies.refresh;

        if (!accessToken) return res.status(401).send("Access token not found!!");

        jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, (err, user) => {
            if (err) {
                const newAccessToken = renewAccessToken(refreshToken);
                req.user = newAccessToken.user;
                req.role = newAccessToken.role;
                // add this new access token to the request header access cookie
                res.cookie('access', newAccessToken.newAccess, {maxAge: 3600*1000, httpOnly: true, sameSite: 'lax'}) // secure: true,
                next();
            }
            else {
                req.user = user.userId;
                req.role = user.role;
                next();
            }
        });
    }
};


module.exports = {
    authJWTMiddleware
}
