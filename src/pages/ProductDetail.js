import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [comment, setComment] = useState("");
  const [star, setStar] = useState(5);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    axios
      .get(`https://keldibekov.online/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Ma'lumotni yuklashda xatolik!");
        setLoading(false);
      });
  }, [id]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Iltimos, avval tizimga kiring!");
        return;
      }

      await axios.post(
        "https://keldibekov.online/likes",
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProduct((prev) => ({
        ...prev,
        totalLikes: (prev.totalLikes || 0) + 1,
      }));
    } catch (error) {
      alert("Like bosishda xatolik!");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (isCommenting || !comment.trim()) return;
    setIsCommenting(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!token || !user) {
        alert("Iltimos, avval tizimga kiring!");
        return;
      }

      const res = await axios.post(
        "https://keldibekov.online/comments",
        { productId: id, text: comment, star },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newComment = {
        ...res.data,
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
        },
      };

      setProduct((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }));

      setComment("");
      setStar(5);
    } catch (error) {
      alert("Izoh qo'shishda xatolik!");
    } finally {
      setIsCommenting(false);
    }
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Yuklanmoqda...</h2>;
  if (error) return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;

  return (
    <div style={{ padding: "50px", fontFamily: "Arial", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>{product.name}</h1>

      <img
        src={product.img || "https://via.placeholder.com/350"}
        alt={product.name}
        style={{ width: "30%", borderRadius: "10px", marginBottom: "20px" }}
      />

      <p style={{ fontSize: "18px", color: "#333" }}>📌 {product.category?.name}</p>
      <p style={{ fontSize: "18px", color: "#333" }}>🎨 Rang: {product.color?.name}</p>
      <p style={{ fontSize: "18px", fontWeight: "bold", color: "#222" }}>
        💰 Narx: <span style={{ textDecoration: product.skidka ? "line-through" : "none" }}>${product.price}</span> {product.skidka ? `→ $${product.discountedPrice}` : ""}
      </p>

      {/* Yangi qism: Product haqida batafsil ma'lumot */}
      <p style={{ fontSize: "18px", color: "#555", marginTop: "10px" }}>
        📝 <strong>Tavsif:</strong> {product.description}
      </p>

      {/* Yangi qism: Mahsulot egasi haqida */}
      <p style={{ fontSize: "18px", color: "#555", marginTop: "10px" }}>
        👤 <strong>Mahsulot egasi:</strong> {product.user?.firstname} {product.user?.lastname} ({product.user?.email})
      </p>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={handleLike}
          style={{
            background: isLiking ? "#ccc" : "#4F959D",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: isLiking ? "not-allowed" : "pointer",
            marginRight: "10px",
          }}
          disabled={isLiking}
        >
          ❤️ Like ({product.totalLikes || 0})
        </button>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Fikringizni yozing..."
          rows="3"
          style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
        ></textarea>

        <label style={{ display: "block", marginTop: "10px" }}>
          ⭐ Reyting:
          <div style={{ fontSize: "24px", cursor: "pointer" }}>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                onClick={() => setStar(i + 1)}
                style={{
                  color: i < star ? "#f39c12" : "#ddd",
                  transition: "color 0.2s",
                  fontSize: "30px",
                  marginRight: "5px",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </label>

        <button
          onClick={handleCommentSubmit}
          style={{
            background: "#f39c12",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: isCommenting ? "not-allowed" : "pointer",
            marginTop: "10px",
          }}
          disabled={isCommenting}
        >
          💬 Izoh qo‘shish
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>💬 Izohlar:</h3>
        {product.comments.length > 0 ? (
          product.comments.map((c, index) => (
            <div key={index} style={{ background: "#f8f8f8", padding: "10px", borderRadius: "5px", marginBottom: "10px" }}>
              <strong>
                {c.user?.firstname || "Ism yo‘q"} {c.user?.lastname || ""}
              </strong>
              <p>{c.text}</p>
              <p style={{ fontSize: "20px", color: "#f39c12" }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < c.star ? "#f39c12" : "#ddd" }}>
                    ★
                  </span>
                ))}
              </p>
            </div>
          ))
        ) : (
          <p>Hozircha izohlar yo‘q.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
