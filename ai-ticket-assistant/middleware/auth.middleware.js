import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
// export const authenticate1 = (req, res, next) => {
//     const token = req.headers.authorization.split(" ")[1];
//     if (!token)
//         return res
//             .status(401)
//             .json({ error: "Access denied as no token. found" });
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({ error: "Invalid token" });
//     }
// };

export const authenticate = asyncHandler(async (req,res,next) => {
    try {
        const token =
        req.cookies?.token ||
        req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) throw new ApiError(401, "Unauthorized request");


        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken?._id).select(
            "-password"
        );
        if (!user) throw new ApiError(401, "Invalid access token");
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
})