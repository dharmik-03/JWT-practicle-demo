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




export default {registerManager}