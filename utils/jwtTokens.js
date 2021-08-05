const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const generateAccessToken = (payload) => {
    const access = jwt.sign({payload}, process.env.SECRET_KEY, {
        expiresIn: 180, //"1h",
        jwtid: uuidv4(),
    });

    return access;
};

const generateAccessRefreshTokens = async (payload) => {
    const access = generateAccessToken(payload)

    let refresh = await RefreshToken.createToken(payload);
    
    return token = { access, refresh };
};

module.exports = { generateAccessRefreshTokens, generateAccessToken };