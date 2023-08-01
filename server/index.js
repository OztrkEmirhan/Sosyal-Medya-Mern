import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* KONFİGÜRASYONLAR */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* DOSYA DEPOLAMA */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* DOSYALI ROTALAR */
// "/auth/register" yoluna POST isteğiyle "picture" adlı dosya eklenerek "register" işlevi çalıştırılır.
app.post("/auth/register", upload.single("picture"), register);

// "/posts" yoluna POST isteğiyle "picture" adlı dosya eklenerek "createPost" işlevi çalıştırılır.
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROTALAR */
// "/auth" yoluna gelen istekleri "authRoutes" yönlendiricisine yönlendirir.
app.use("/auth", authRoutes);

// "/users" yoluna gelen istekleri "userRoutes" yönlendiricisine yönlendirir.
app.use("/users", userRoutes);

// "/posts" yoluna gelen istekleri "postRoutes" yönlendiricisine yönlendirir.
app.use("/posts", postRoutes);

/* MONGOOSE AYARLARI */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Sunucu Port: ${PORT}`));

    /* BİR DEFA VERİ EKLEME */
    // users ve posts veri tabanına bir defalığına eklenir.
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} bağlanılamadı`));
