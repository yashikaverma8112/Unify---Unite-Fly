const jwt = require('jsonwebtoken');
const errorHandler=  require('./error.js');
const jwtSecret = "mhassdbbvbbvbdbvdndnduhuvnd";
const verifyToken = (req, res, next) => {
    // const token = req.cookies && req.cookies.access_token;
    const token = req.headers.access_token;
    // console.log(req);
    console.log('req.headers:', req.headers);

    if (!token) 
    {
        console.log('No token found'); 
        console.log(token);
        return next(errorHandler(401, 'You are not authenticated!'));
    }

    jwt.verify(token,jwtSecret, (err, user) => {
        if (err) 
        {
            console.log('Token verification failed');
            return next(errorHandler(403, 'Token is not valid!'));
        }

        req.user = user;
        console.log('User authenticated:', user);
        next();
    });


}
module.exports = verifyToken