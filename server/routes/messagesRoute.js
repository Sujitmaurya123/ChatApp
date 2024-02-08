import { addMessage, getMessages } from "../controllers/messagesController.js";
import express from "express";

const router = express.Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);


export { router as messagesRoute }