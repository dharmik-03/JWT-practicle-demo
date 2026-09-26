import managerModel from "../model/manager.js"

const registerManager = async (req, res, next) => {
    try {
        const { name, email, salary, designation ,password} = req.body

        const manager = new managerModel({

            name, email, salary, designation,password

        })

        await manager.save()


        res.status(201).json({
            success: true,
            message: "manager register success",
            manager
        })


    } catch (error) {

         res.status(500).json({
            success: false,
            message: error.message,
        });

    }
}


const loginManager = async (req, res) => {
    try {
        const { email, password } = req.body;

        const manager = await managerModel.findByCredentials(
            email,
            password
        );

        const token = await manager.generateAuthToken();

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            data: manager,
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

export default {registerManager,loginManager}