const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
    const access = jwt.sign({payload}, process.env.ACCESS_SECRET_KEY, {
        expiresIn: "60000", // change to "1h",
        jwtid: uuidv4(),
        subject: "access"
    });

    return access;
};

const generateRefreshToken = (payload) => {
    const refresh = jwt.sign({payload}, process.env.REFRESH_SECRET_KEY, {
        expiresIn: "1 day", // change to "1h",
        jwtid: uuidv4(),
        subject: "refresh"
    });

    return refresh;
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
}
