import JWT from "jsonwebtoken";
import adminModel from "../model/admin.js";

const auth = async (req, res, next) => {
    try {

        const authHeader = req.header("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required",
            });
        }

        const token = authHeader.replace("Bearer ", "");

        const decoded = JWT.verify(
            token,
            process.env.JWT_SECRET
        );

        const admin = await adminModel.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed",
            });
        }


        req.admin = admin;
        req.token = token;

        next();

    } catch (error) {

        

        res.status(401).json({
            success: false,
            message: "Please authenticate",
        });
    }
};

export default auth;