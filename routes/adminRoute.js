import express from "express"

import adminContoller from "../controller/adminContoller.js";


const router = express.Router();


router.post("/register", adminContoller.registerAdmin);

router.post("/login", adminContoller.loginAdmin);


export default router