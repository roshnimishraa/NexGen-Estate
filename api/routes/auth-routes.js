import { signup , login , google , logout} from "../controllers/auth-controller.js";
import express from "express";

const router = express.Router();

router.post("/signup" , signup);
router.post("/login" , login);
router.post("/google" , google);
router.get("/logout" , logout)

export default router;