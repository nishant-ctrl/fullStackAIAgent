import express from "express";
import {
    signup,
    login,
    logout,
    updateUser,
    getUsers,
    getUserInfo,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/update-user", authenticate, updateUser);
router.get("/users", authenticate, getUsers);
router.get("/user", authenticate, getUserInfo);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authenticate,logout);

export default router;
