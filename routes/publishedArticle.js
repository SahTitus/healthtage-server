import express from "express";
import {
 publishArticle,
 getArticle,
 getArticles,
} from "../controllers/publishedArticle.js";

const router = express.Router();



router.route("/").get(getArticles);
router.route("/").post(publishArticle);

router.route("/:id").get(getArticle);



export default router;
