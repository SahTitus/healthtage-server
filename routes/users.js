import express from "express";
import {
	signin,
	signup,
	getUser,
	googleAuth,
	fetchFavoriteArticles,
	addToFavoriteArticles,
} from "../controllers/users.js";

const router = express.Router();

router.route("/:id").get(getUser);
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/googleAuth").post(googleAuth);
router.route("/:id/favoriteArticles").get(fetchFavoriteArticles);
router.route("/:id/addTofavorites").patch(addToFavoriteArticles);

export default router;