import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        match: [/.+\@.+\..+/, "Please enter a valid email"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password should be at least 6 characters"], 
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                default: 1,
            }
        }
    ],
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    }
    //createdAt, updatedAt
 }, 
 {
    timestamps: true,
 });



 //Pre-save hook to hash password before saving to db
    userSchema.pre("save", async function (next) {
        if (!this.isModified("password")) {
            return next();
        }
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt); // 12345 = :asud:@34.{e3}
            next();
        } catch (error) {
            next(error);
        }
    })

    userSchema.methods.comparePassword = async function (password) {
        return bcrypt.compare(password, this.password); 
    }

    const User = mongoose.model("User", userSchema);

 export default User;