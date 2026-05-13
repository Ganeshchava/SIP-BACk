import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {

    try {

        // get token from headers

        const authHeader = req.headers.authorization;

        // check token exists

        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        // remove Bearer

        const token = authHeader.split(" ")[1];

        // verify token

        const decoded = jwt.verify(
            token,
            "mysecretkey"
        );

        // attach user data

        req.user = decoded;

        next();

    } catch (error) {

        res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
};

export default protect;