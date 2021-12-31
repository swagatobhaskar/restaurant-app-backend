const jwt = require('jsonwebtoken');

const { renewAccessToken } = require('./jwtGen');

const excludedPaths = [
    '/api/users/login/',
    '/api/users/signup/',
    '/api/users/signup',
	'/api/menus/',
    '/api/menus',
    '/api/menus/images/all',
    '/api-docs/',
    '/api-docs',
]

function authJWTMiddleware(req, res, next) {

    if (excludedPaths.includes(req.path)) {
        //console.log(req.path);
        next();

    } else if (req.path.includes('/api-docs')) {
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

function logVisit(req, res, next) {
	console.log(req.method, " ", req.originalUrl, " ", new Date());
	next();
}

module.exports = {
    authJWTMiddleware,
	logVisit
}
