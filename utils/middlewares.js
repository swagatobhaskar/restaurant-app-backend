const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const { generateAccessToken, generateRefreshToken } = require('./jwtGen');

const excludedPaths = [
    '/api/users/login/',
    '/api/users/signup/',
]

function authJWTMiddleware(req, res, next) {

    if (excludedPaths.includes(req.path)) {
        console.log("URL found: ", req.path);
        next();
    } else {

        const accessToken = req.cookies.access;
        const refreshToken = req.cookies.refresh;
        console.log("access, refresh in cookie:", accessToken," ", refreshToken);

        if (!accessToken) return res.status(401).send("Access token not found!!");

        jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, (err, user) => {
            if (err) {
                console.log("Access token expired! generating new access");
                const newToken = renewAccessToken(refreshToken);
                console.log("New token: ",newToken);
            }
            // in django request.META['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'
            req.user = user;
            next();
        });
    }
};

function renewAccessToken(refreshToken, payload) {
    if (!refreshToken) return res.status(401).send("Refresh token not found!!");
    try{
        jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
        const newAccess = generateAccessToken(payload);
        return newAccess;
        
    } catch (TokenExpiredError) {
        console.log("REFRESH expired");
    }
}

module.exports = authJWTMiddleware;

/*
except jwt.ExpiredSignatureError:
                refresh_cookie = request.COOKIES['refresh']
                data = {"refresh": refresh_cookie}

                if settings.DEBUG:
                    url = 'http://127.0.0.1:8000/api/auth/refresh/'
                else:
                    scheme = request.is_secure() and "https" or "http"
                    url = scheme + "://" + request.get_host() + "api/auth/refresh/"
                resp = requests.post(url, data=data)

                #access_dict_as_string = resp.content.decode("utf-8")
                access_token_string = json.loads(resp.text)["access"]
                request.META['HTTP_AUTHORIZATION'] = f'Bearer {access_token_string}'
                return self.get_response(request)
*/