import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* KULLANICI KAYDI */
/* Bu fonksiyon, kullanıcı kaydını gerçekleştirir. Kayıt sırasında istenen bilgileri içerir. */
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        // Şifre için tuz oluşturuluyor.
        const salt = await bcrypt.genSalt();
        // Şifre, oluşturulan tuz kullanılarak hashleniyor.
        const passwordHash = await bcrypt.hash(password, salt);

        // Yeni bir kullanıcı nesnesi oluşturuluyor.
        const newuser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        // Kullanıcı kaydediliyor ve dönen sonuç 201 koduyla cevaplanıyor.
        const savedUser = await newuser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        // Hata durumunda 500 koduyla hata mesajı döndürülüyor.
        res.status(500).json({ error: err.message });
    }
};

/* GİRİŞ YAPMA */
/* Bu fonksiyon, kullanıcı giriş işlemini gerçekleştirir. Şifre yanlış veya kullanıcı yoksa uyarı mesajı döndürür. */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Giriş yapmaya çalışan kullanıcıyı e-posta adresine göre veritabanında arıyoruz.
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "Kullanıcı bulunamadı." });

        // Girilen şifreyi, veritabanındaki hash ile karşılaştırıyoruz.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Geçersiz kimlik bilgileri." });

        // Kullanıcının kimlik bilgileri doğru ise, kullanıcıya özel bir JWT (JSON Web Token) oluşturuyoruz.
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        // Şifreyi cevap olarak göndermeden önce kullanıcı nesnesinden siliyoruz.
        delete user.password;
        // Giriş başarılı, 200 koduyla cevaplanıyor ve token ile kullanıcı bilgileri gönderiliyor.
        res.status(200).json({ token, user });
    } catch (err) {
        // Hata durumunda 500 koduyla hata mesajı döndürülüyor.
        res.status(500).json({ error: err.message });
    }
};
