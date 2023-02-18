import express from "express";
import {
	signin,
	signup,
	getUser,
	googleAuth,
} from "../controllers/users.js";

const router = express.Router();

router.route("/:id").get(getUser);
router.route("/signup").post(signup);
router.route("/googleAuth").post(googleAuth);
router.route("/signin").post(signin);



export default router;