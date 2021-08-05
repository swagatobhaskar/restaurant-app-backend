const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshToken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/users');

const generateAccessToken = (payload) => {
    const access = jwt.sign({payload}, process.env.SECRET_KEY, {
        expiresIn: 180, //"1h",
        jwtid: uuidv4(),    // required for refresh token as it points to one unique access token
    });

    return access;
};

const generateAccessRefreshTokens = async (payload) => {
    const access = generateAccessToken(payload)

    let refresh = await RefreshToken.createToken(payload);
    
    return token = { access, refresh };
};


const handleTokenRegeneration = async(req, res) => {
    // get the refresh token from the cookies
    const refreshTokenCookie = req.cookies.refresh;
    console.log("Inside token regeneration");
    
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

            const tokens = {
                'access': newAccessToken,
                'refresh': refreshToken.token
            };

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

        } catch(err) {
            return res.status(500).send({ message: err });
        }
    } else {
        return res.status(401).send('Refresh Token not Found');
    }
}


module.exports = {
    generateAccessRefreshTokens,
    handleTokenRegeneration
};