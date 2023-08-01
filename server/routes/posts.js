import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* GÖNDERİLERİ OKU */
/* Bu route, kullanıcının takip ettiği gönderileri getirir. Kullanıcı kimliği doğrulanmalıdır. */
router.get("/", verifyToken, getFeedPosts);

/* KULLANICININ GÖNDERİLERİNİ OKU */
/* Bu route, belirli bir kullanıcının gönderilerini getirir. Kullanıcı kimliği doğrulanmalıdır. */
router.get("/:userId/posts", verifyToken, getUserPosts);

/* GÖNDERİYİ BEĞENMEK İÇİN GÜNCELLE */
/* Bu route, belirli bir gönderiyi beğenmek veya beğeniden çıkmak için kullanılır. Kullanıcı kimliği doğrulanmalıdır. */
router.patch("/:id/like", verifyToken, likePost);

export default router;
