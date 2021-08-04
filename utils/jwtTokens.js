const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshToken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/users');

const generateTokens = async (payload) => {
    const access = jwt.sign({payload}, process.env.SECRET_KEY, {
        expiresIn: "1h",
        jwtid: uuidv4(),    // required for refresh token as it points to one unique access token
        subject: String(payload),
    });

    let refresh = await RefreshToken.createToken(payload);
    
    return token = { access, refresh };
}


const handleRefreshToken = async(req, res) => {
    // get the refresh token from the cookies
    const refreshTokenCookie = req.cookies.refresh;
    
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

            let newAccessToken = jwt.sign({ id: refreshToken.user._id }, process.env.SECRET_KEY, {
                expiresIn: "1h",
                jwtid: uuidv4(),    // required for refresh token as it points to one unique access token
                subject: user._id.toString()
            });

            const tokens = {
                'access': newAccessToken,
                'refresh': refreshToken.token
            };

            return res.cookie('token', tokens, {
                //maxAge: toDate(newAccessToken.expiresIn),
                httpOnly: true,
                sameSite: 'lax',
            })

        } catch(err) {
            return res.status(500).send({ message: err });
        }
    } else {
        return res.status(401).send('Refresh Token not Found');
    }
}


module.exports = { generateTokens, handleRefreshToken };