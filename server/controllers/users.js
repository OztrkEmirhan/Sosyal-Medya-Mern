import User from "../models/User.js";

/* KULLANICI BİLGİLERİNİ GETİR */
/* Bu fonksiyon, belirli bir kullanıcının bilgilerini getirir. Kullanıcının kimliği (id) parametre olarak alınır. */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        // İlgili kullanıcıyı veritabanından id kullanarak buluyoruz.
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        // Hata durumunda 404 koduyla hata mesajı döndürülüyor.
        res.status(404).json({ message: err.message });
    }
};

/* KULLANICI ARKADAŞLARINI GETİR */
/* Bu fonksiyon, belirli bir kullanıcının arkadaşlarını getirir. Kullanıcının kimliği (id) parametre olarak alınır. */
export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        // İlgili kullanıcıyı veritabanından id kullanarak buluyoruz.
        const user = await User.findById(id);

        // Kullanıcının arkadaşlarını belirli bir formatta çekiyoruz.
        const friends = await Promise.all(user.friends.map((id) => User.findById(id)));
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends); // Düzeltme: formattedFriends dizisini cevap olarak gönderiyoruz.
    } catch (err) {
        // Hata durumunda 404 koduyla hata mesajı döndürülüyor.
        res.status(404).json({ message: err.message });
    }
};

/* ARKADAŞ EKLEME/ÇIKARMA */
/* Bu fonksiyon, belirli bir kullanıcının arkadaş eklemesini veya çıkarmasını gerçekleştirir. */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        // İlgili kullanıcıyı ve arkadaşını veritabanından id kullanarak buluyoruz.
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            // Eğer kullanıcının arkadaşları arasında belirtilen arkadaşı buluyorsak, arkadaşlığı çıkarıyoruz.
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            // Eğer kullanıcının arkadaşları arasında belirtilen arkadaşı bulamazsak, arkadaş olarak ekliyoruz.
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        // Değişikliklerin kaydedilmesi.
        await user.save();
        await friend.save();

        // Güncellenmiş arkadaş listesini belirli bir formatta çekiyoruz.
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        // Hata durumunda 404 koduyla hata mesajı döndürülüyor.
        res.status(404).json({ message: err.message });
    }
};
