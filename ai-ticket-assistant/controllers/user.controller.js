import { User } from "../models/user.model.js";
import { inngest } from "../inngest/client.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// export const signup1 = async (req, res) => {
//     const { email, password, skills = [] } = req.body;
//     try {
//         const existedUser = await User.findOne({ email });
//         if (existedUser)
//             return res
//                 .status(400)
//                 .json({ error: "User with this email already exists" });
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({
//             email,
//             password: hashedPassword,
//             skills,
//         });
//         console.log("REACHED");

//         inngest.send({
//             name: "user/signup",
//             data: {
//                 email,
//             },
//         });

//         const token = jwt.sign(
//             {
//                 _id: user._id,
//                 role: user.role,
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: process.env.JWT_TOKEN_EXPIRY,
//             }
//         );
//         res.status(201).json({ user, token });
//     } catch (error) {
//         res.status(500).json({
//             error: "Signup failed",
//             datails: error.message,
//         });
//     }
// };

export const signup = asyncHandler(async (req, res) => {
    const { email, password, skills = [] } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(400, "User already registered with this email.");
    }
    const user = await User.create({
        email,
        password,
        skills,
    });
    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser)
        throw new ApiError(500, "Something went wrong while registering user.");
    
    // inngest.send({
    //     name: "user/signup",
    //     data: {
    //         email,
    //     },
    // });
    
    const token = await createdUser.generateJwtToken();
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(201)
        .cookie("token", token, options)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully")
        );
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        throw new ApiError(400, "Email is required.");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Password is incorrect");
    const token = user.generateJwtToken();
    const loggedInUser = await User.findById(user._id).select("-password");
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("token", token, options)
        .json(
            new ApiResponse(200, loggedInUser, "User logged in successfully")
        );
});

// export const login1 = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(401).json({ error: "User not found" });
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ error: "Invalid credentials" });
//         }
//         const token = jwt.sign(
//             {
//                 _id: user._id,
//                 role: user.role,
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: process.env.JWT_TOKEN_EXPIRY,
//             }
//         );
//         res.status(200).json({ user, token });
//     } catch (error) {
//         res.status(500).json({
//             error: "Login failed",
//             datails: error.message,
//         });
//     }
// };

export const logout = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("token", options)
        .json(new ApiResponse(200, {}, "Userloggedout"));
});

// export const logout1 = async (req, res) => {
//     try {
//         const token = req.headers.authorization.split(" ")[1];
//         if (!token) return res.status(401).json({ error: "Unauthorized" });
//         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 return res.status(401).json({ error: "Unauthorized" });
//             }
//             return res.status(200).json({ message: "Logout successfully" });
//         });
//     } catch (error) {
//         res.status(500).json({
//             error: "Logout failed",
//             datails: error.message,
//         });
//     }
// };

export const updateUser = asyncHandler(async (req, res) => {
    const { skills = [], role, email } = req.body;

    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Forbidden.");
    }
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "User not found.");
    await User.updateOne(
        { email },
        { skills: skills.length ? skills : user.skills, role }
    );
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User updated successfully"));
});

export const getUsers = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") throw new ApiError(403, "Forbidden.");
    const users = await User.find().select("-password");
    return res
        .status(200)
        .json(new ApiResponse(200, users, "Fetched all users"));
});
