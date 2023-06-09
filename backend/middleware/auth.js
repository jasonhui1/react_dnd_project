import jwt from "jsonwebtoken";
const secret = 'test';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; //req.header = [Bearer Token]
        const decodedData = jwt.decode(token);
        req.userId = decodedData?.sub;
        next();
    } catch (error) {
        console.log('UnAuthorised');
    }
};

export default auth;