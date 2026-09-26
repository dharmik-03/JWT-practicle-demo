import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
         
        },

        email: {
            type: String,
            required: true,
            unique: true
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

        status: {
            type: Boolean,
            default: true,
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
        timestamps: true,
    }
);


adminSchema.pre("save", async function () {

    const admin = this;

    if (admin.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 10);
    }
});


adminSchema.statics.findByCredentials = async function (email, password) {

    const admin = await this.findOne({ email });

    if (!admin) {
        throw new Error("Unable to login");
    }

    const isMatched = await bcrypt.compare(
        password,
        admin.password
    );

    if (!isMatched) {
        throw new Error("Unable to login");
    }

    return admin;
};


adminSchema.methods.generateAuthToken = async function () {

    const admin = this;

    const token = JWT.sign(
        {
            _id: admin._id.toString(),
            email: admin.email,
            role: admin.Role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    admin.tokens = admin.tokens.concat({ token });

    await admin.save();

    return token;
};


const adminModel = mongoose.model("admin", adminSchema);

export default adminModel;