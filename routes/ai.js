import express from "express";
import {
 ai
} from "../controllers/ai.js";

const router = express.Router();

router.route("/").post(ai);

export default router;
