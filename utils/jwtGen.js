const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const generateAccessToken = (payload) => {
    const access = jwt.sign({userId: payload}, process.env.ACCESS_SECRET_KEY, {
        expiresIn: "60000", // change to "1h",
        jwtid: uuidv4(),
        subject: "access"
    });

    return access;
};

const generateRefreshToken = (payload) => {
    const refresh = jwt.sign({userId: payload}, process.env.REFRESH_SECRET_KEY, {
        expiresIn: "1 day", // change to "1h",
        jwtid: uuidv4(),
        subject: "refresh"
    });

    return refresh;
};


function renewAccessToken(refreshToken) {
    if (!refreshToken) return res.status(401).send("Refresh token not found!!");
    try{
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
        const newAccess = generateAccessToken(decodedRefreshToken.payload);
        return newAccess;
        
    } catch (TokenExpiredError) {
        console.log("REFRESH expired");
    }
}


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    renewAccessToken
}
