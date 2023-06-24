import express from "express";
import {
  getArticles,
  getArticlesByCategory,
  getArticlesBySearch,
  getArticle,
} from "../controllers/articles.js";
// import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getArticles);
router.route("/search").get(getArticlesBySearch);
router.route("/category").get(getArticlesByCategory);

router.route("/:id").get(getArticle);

export default router;
