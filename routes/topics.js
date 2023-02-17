import express from "express";
import {
  getTopics,
  getTopicsBySearch,
} from "../controllers/topics.js";
// import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getTopics);
router.route("/search").get(getTopicsBySearch);


export default router;
