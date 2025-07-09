import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { inngest } from "../inngest/client.js";

export const signup = async (req, res) => {
    const { email, password, skills = [] } = req.body;
    try {
        const existedUser = await User.findOne({ email });
        if (existedUser)
            return res
                .status(400)
                .json({ error: "User with this email already exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
            skills,
        });
        console.log("REACHED");

        inngest.send({
            name: "user/signup",
            data: {
                email,
            },
        });

        const token = jwt.sign(
            {
                _id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_TOKEN_EXPIRY,
            }
        );
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({
            error: "Signup failed",
            datails: error.message,
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign(
            {
                _id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_TOKEN_EXPIRY,
            }
        );
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({
            error: "Login failed",
            datails: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            return res.status(200).json({ message: "Logout successfully" });
        });
    } catch (error) {
        res.status(500).json({
            error: "Logout failed",
            datails: error.message,
        });
    }
};

export const updateUser = async (req, res) => {
    const { skills = [], role, email } = req.body;
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "User not found" });
        await User.updateOne(
            { email },
            { skills: skills.length ? skills : user.skills, role }
        );
        return res.status(200).json({ error: "User updated successfully" });
    } catch (error) {
        return res.status(401).json({ error: "Update Failed" });
    }
};

export const getUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ error: "Forbidden" });
        const users = await User.find().select("-password");
        return res.status(200).json(users);
    } catch (error) {
        return res.status(501).json({ error: "Error while getting users" });
    }
};
