import jwt from "jsonwebtoken";

const generateToken = (userId) => {

    return jwt.sign(

        { id: userId },

        "mysecretkey",

        {
            expiresIn: "7d"
        }
    );
};

export default generateToken;   