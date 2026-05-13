import client from "../config/db.js";

import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {

    try {

        const { full_name, email, password } = req.body;

        // check existing user

        const existingUser = await client.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (existingUser.rows.length > 0) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // insert user

        const newUser = await client.query(

            `INSERT INTO users
            (full_name, email, password)
            VALUES($1,$2,$3)
            RETURNING *`,

            [full_name, email, password]
        );

        // generate token

        const token = generateToken(
            newUser.rows[0].user_id
        );

        res.status(201).json({

            success: true,

            message: "User Registered",

            token,

            user: newUser.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};

export const loginUser = async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user=await client.query(
            "select * from users where email=$1",[email]
        );
        if(user.rows.length===0){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if(user.rows[0].password!==password){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token=generateToken(user.rows[0].user_id);
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: user.rows[0]
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}