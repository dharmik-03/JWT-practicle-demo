import express from "express"
import managerControler from "../controller/managerControler.js"
import auth from "../middlewares/auth.js"

const router=express()

router.post("/register",auth,managerControler.registerManager)
router.post("/login",managerControler.loginManager)

export default router