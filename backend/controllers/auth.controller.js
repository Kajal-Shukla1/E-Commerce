import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });

    return { accessToken, refreshToken };
}

const storeRefreshToken = async (userId, refreshToken) => {
    // Store the refresh token in Redis with a TTL (time to live) of 7 days
    await redis.set(`refresh_token:${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7);
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, //prevents XSS Attack- cross site scripting
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //prevents CSRF Attack - cross site request forgery
        maxAge: 15 * 60 * 1000, // 15 minutes
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, //prevents XSS Attack- cross site scripting
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", //prevents CSRF Attack - cross site request forgery
        maxAge: 7 * 24 * 60 * 60, // 7 days
    })
}

export const signup =  async(req,res) => {
    try {
        const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });

    if(userExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    const user =await User.create({name, email, password})

    //authenticate(redis)
    const {accessToken, refreshToken} = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    
    setCookies(res, accessToken, refreshToken);


    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: "User created successfully"});
    } catch (error) {
        console.log("Signup controller error: ", error.message);
         res.status(500).json({ message: error.message });
    }
};

export const login =  async(req,res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(user && (await user.comparePassword(password))) {
            //authenticate(redis)
            const {accessToken, refreshToken} = generateTokens(user._id);
            await storeRefreshToken(user._id, refreshToken);
            
            setCookies(res, accessToken, refreshToken);


            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.log("Login controller error: ", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const logout =  async(req,res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken){
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`); //delete the refresh token from redis);
        }  
        
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logged out successfully" });
    } 
    catch (error) {
        console.log("Logout controller error: ", error.message);
        res.status(500).json({ message: "Server error", error:error.message });  
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedRefreshToken = await redis.get(`refresh_token:${decoded.userId}`);

        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate new tokens
        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m" });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.status(200).json({ message: "Tokens refreshed successfully" });
    } catch (error) {
        console.log("Refresh token controller error: ", error.message);
        res.status(500).json({ message: "Server error", error:error.message });  
    }
}

// TODO: Implement getProfile controller
//export const getProfile = async (req, res) => {}