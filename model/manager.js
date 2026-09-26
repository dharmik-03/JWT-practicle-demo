import mongoose from "mongoose";
import httpError from "../middlewares/httpError.js"
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";

const managerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,

        },
        email: {
            type: String,
            required: true,
            unique: true,

        },
        salary: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            default: true
        },
        designation: {
            type: String
        },
        password: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return value.toLowerCase() !== "password";
                },
                message: "Password cannot be 'password'",
            },
        },
        Role: {
            type: String,
            enum: ["manager", "admin"],
            default: "manager",
            required: true,
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],

    },
    {
        timestamps: true
    }
);


managerSchema.pre("save", async function () {

    const manager = this;

    if (manager.isModified("password")) {
        manager.password = await bcrypt.hash(manager.password, 10);
    }
});


managerSchema.statics.findByCredentials = async function (email, password) {

    const manager = await this.findOne({ email });

    if (!manager) {
        throw new Error("Unable to login");
    }

    const isMatched = await bcrypt.compare(
        password,
        manager.password
    );

    if (!isMatched) {
        throw new Error("Unable to login");
    }

    return manager;
};


managerSchema.methods.generateAuthToken = async function () {

    const manager = this;

    const token = JWT.sign(
        {
            _id: manager._id.toString(),
            email: manager.email,
            role: manager.Role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    manager.tokens = manager.tokens.concat({ token });

    await manager.save();

    return token;
};




const managerModel = mongoose.model("manager", managerSchema);

export default managerModel