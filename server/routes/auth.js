import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

/* KULLANICI GİRİŞİ İÇİN ROUTE */
/* Bu route, kullanıcı girişi işlemini gerçekleştirir. "login" işlevi, POST istekleriyle "/login" yoluna bağlanır. */
router.post("/login", login);

export default router;
