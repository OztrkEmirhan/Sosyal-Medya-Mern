import jwt from "jsonwebtoken";

/* TOKEN DOĞRULAMA MİDDLEWARE */
/* Bu fonksiyon, gelen isteklerde bulunan JWT (JSON Web Token) token'larını doğrular.
   Eğer token doğrulanamazsa erişim reddedilir, aksi takdirde istekin devam etmesine izin verilir.
   JWT, kullanıcının kimlik doğrulaması için kullanılan bir yöntemdir. */
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        // İstekte token yoksa, erişim reddedilir ve 403 koduyla "Access Denied" mesajı döndürülür.
        if (!token) {
            return res.status(403).send("Erişim Reddedildi");
        }

        // Token başında "Bearer " (Bearer ile başlayan) bir ifade varsa, bunu kaldırıyoruz.
        if (token.startsWith("Bearer")) {
            token = token.slice(7, token.length).trimLeft();
        }

        // JWT'yi doğruluyoruz ve içeriğini çıkarıyoruz.
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Doğrulanan kullanıcı bilgilerini istek nesnesine ekliyoruz.
        next(); // Sonraki middleware veya route işlevine geçiş yapmak için 'next()' fonksiyonunu çağırıyoruz.
    } catch (err) {
        // Hata durumunda 500 koduyla hata mesajı döndürülüyor.
        res.status(500).json({ error: err.message });
    }
};
