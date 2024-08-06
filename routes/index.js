import express from "express";
const router = express.Router();
import { renderHandler, textgenerationHandler, modelHandler } from "../src/handlers.js";

router.get('/', renderHandler);

router.post('/textgeneration', textgenerationHandler);

router.get('/models', modelHandler);

export default router;
