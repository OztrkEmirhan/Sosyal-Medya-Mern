import Post from "../models/Post.js";
import User from "../models/User.js";

/* OLUŞTUR */
/* Bu fonksiyon, yeni bir gönderi (post) oluşturmak için istenen bilgilerle yeni bir post oluşturur ve bilgileri içinde saklar. */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    // İlgili kullanıcıyı veritabanından userId kullanarak buluyoruz.
    const user = await User.findById(userId);
    // Yeni bir Post nesnesi oluşturuyoruz ve bu nesneyi veritabanına kaydediyoruz.
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {}, // Başlangıçta beğeni sayısını tutan bir nesne oluşturuyoruz.
      comments: [], // Başlangıçta yorumları tutan bir dizi oluşturuyoruz.
    });
    await newPost.save();

    // Tüm postları alıp cevap olarak gönderiyoruz (yeni post dahil).
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    // Hata durumunda 409 koduyla hata mesajı döndürülüyor.
    res.status(409).json({ message: err.message });
  }
};

/* OKU */
/* Bu fonksiyon, kaydedilen tüm gönderileri gösterir. */
export const getFeedPosts = async (req, res) => {
  try {
    // Tüm postları alıp cevap olarak gönderiyoruz.
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    // Hata durumunda 404 koduyla hata mesajı döndürülüyor.
    res.status(404).json({ message: err.message });
  }
};

/* Belirli bir kullanıcının gönderilerini gösterir. */
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    // İlgili kullanıcının gönderilerini veritabanından userId kullanarak buluyoruz.
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    // Hata durumunda 404 koduyla hata mesajı döndürülüyor.
    res.status(404).json({ message: err.message });
  }
};

/* GÜNCELLE */
/* Bu fonksiyon, bir gönderiyi beğenme işlemini gerçekleştirir. */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    // İlgili postu veritabanından id kullanarak buluyoruz.
    const post = await Post.findById(id);
    // Kullanıcının bu postu daha önceden beğenip beğenmediğini kontrol ediyoruz.
    const isLiked = post.likes.get(userId);

    // Kullanıcı postu daha önceden beğenmişse, beğeniyi kaldırıyoruz; aksi takdirde beğeniyi ekliyoruz.
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    // Beğeni durumunu güncelliyoruz ve güncellenmiş post nesnesini veritabanına kaydediyoruz.
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    // Hata durumunda 404 koduyla hata mesajı döndürülüyor.
    res.status(404).json({ message: err.message });
  }
};
