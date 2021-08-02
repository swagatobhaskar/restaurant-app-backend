const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("Access Denied");
    
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

module.exports = {authMiddleware};