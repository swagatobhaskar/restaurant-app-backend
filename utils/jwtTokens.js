const jwt = require('jsonwebtoken');
const User = require('../models/users');
const RefreshToken = require('../models/refreshToken');
const { v4: uuidv4 } = require('uuid');

const generateTokens = async (payload) => {
    const access = jwt.sign({payload}, process.env.SECRET_KEY, {
        expiresIn: "1h",
        jwtid: uuidv4(),    // required for refresh token as it points to one unique access token
        subject: String(payload),
    });

    let refresh = await RefreshToken.createToken(payload);
    console.log("REF: ", refresh);
    return token = { access, refresh };
}

const handleRefreshToken = async(req, res) => {
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
    }
}

module.exports = { generateTokens, handleRefreshToken };