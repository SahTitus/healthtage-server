import express from "express";
import {
 publishArticle
} from "../controllers/publishedArticle.js";

const router = express.Router();

router.route("/").post(publishArticle);



export default router;
