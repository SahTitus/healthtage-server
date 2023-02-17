import express from "express";
import {
	signin,
	signup,
	getUsers,
	getUser,
	updateUser,
	googleAuth,
} from "../controllers/users.js";

const router = express.Router();

router.route("/").get(getUsers);
router.route("/:id").get(getUser);
router.route("/signup").post(signup);
router.route("/googleAuth").post(googleAuth);
router.route("/signin").post(signin);
router.route("/:id/update").patch(updateUser);



export default router;