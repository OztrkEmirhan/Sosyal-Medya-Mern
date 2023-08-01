import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* KULLANICI BİLGİLERİNİ OKU */
/* Bu route, belirli bir kullanıcının bilgilerini getiren `getUser` işlevini yönlendirir. Kullanıcı kimliği doğrulanmalıdır. */
router.get("/:id", verifyToken, getUser);

/* KULLANICI ARKADAŞLARINI OKU */
/* Bu route, belirli bir kullanıcının arkadaşlarını getiren `getUserFriends` işlevini yönlendirir. Kullanıcı kimliği doğrulanmalıdır. */
router.get("/:id/friends", verifyToken, getUserFriends);

/* ARKADAŞ EKLEME/ÇIKARMA */
/* Bu route, belirli bir kullanıcının arkadaş ekleme/çıkarma işlemlerini gerçekleştiren `addRemoveFriend` işlevini yönlendirir. Kullanıcı kimliği doğrulanmalıdır. */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
