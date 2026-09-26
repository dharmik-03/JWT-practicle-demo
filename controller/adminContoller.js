import adminModel from "../model/admin.js";

const registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;


        const admin = new adminModel({
            username,
            email,
            password,
        });

        await admin.save();

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: admin
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await adminModel.findByCredentials(
            email,
            password
        );

        const token = await admin.generateAuthToken();

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            data: admin,
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};


// const update=async (req,res,next) => {
//     try {
        
//     } catch (error) {
        
//     }
// }ṭṭ

export default {
    registerAdmin,
    loginAdmin,
};