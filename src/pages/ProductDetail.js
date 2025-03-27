import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [star, setStar] = useState(5);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

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
    <div style={{ display: "grid", gridTemplateColumns: "0.5fr 1fr", gap: "30px", padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h1 style={{ textAlign: "center", fontSize: "22px" }}>{product.name}</h1>
        <img
          src={product.img || "https://via.placeholder.com/300"}
          alt={product.name}
          style={{ width: "100%", borderRadius: "10px", marginBottom: "15px" }}
        />
        <p style={{ fontSize: "16px", color: "#333" }}>📌 {product.category?.name}</p>
        <p style={{ fontSize: "16px", color: "#333" }}>🎨 Rang: {product.color?.name}</p>
        <p style={{ fontSize: "16px", fontWeight: "bold", color: "#222" }}>
          💰 Narx: <span style={{ textDecoration: product.skidka ? "line-through" : "none" }}>${product.price}</span> {product.skidka ? `→ $${product.discountedPrice}` : ""}
        </p>
        <p style={{ fontSize: "16px", color: "#555", marginTop: "10px" }}>📝 <strong>Tavsif:</strong> {product.description}</p>
        <p style={{ fontSize: "16px", color: "#555", marginTop: "10px" }}>👤 <strong>Mahsulot egasi:</strong> {product.user?.firstname} {product.user?.lastname} ({product.user?.email})</p>

        {/* Like tugmasi */}
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
            }}
            disabled={isLiking}
          >
            ❤️ Like ({product.totalLikes || 0})
          </button>
        </div>
      </div>

      <div>
        <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", marginBottom: "15px" }}>
          <h3 style={{ fontSize: "18px" }}>💬 Izoh qoldirish</h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Fikringizni yozing..."
            rows="3"
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ddd" }}
          ></textarea>
          <label style={{ display: "block", marginTop: "10px" }}>
            ⭐ Reyting:
            <div style={{ fontSize: "20px", cursor: "pointer" }}>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  onClick={() => setStar(i + 1)}
                  style={{
                    color: i < star ? "#f39c12" : "#ddd",
                    transition: "color 0.2s",
                    fontSize: "25px",
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
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: isCommenting ? "not-allowed" : "pointer",
              marginTop: "10px",
              fontSize: "16px",
            }}
            disabled={isCommenting}
          >
            💬 Izoh qo‘shish
          </button>
        </div>

        <div style={{ background: "#fff", padding: "15px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", maxHeight: "300px", overflowY: "auto" }}>
          <h3 style={{ fontSize: "18px" }}>💬 Izohlar</h3>
          {product.comments.length > 0 ? (
            product.comments.map((c, index) => (
              <div key={index} style={{ background: "#f8f8f8", padding: "8px", borderRadius: "5px", marginBottom: "8px" }}>
                <strong>{c.user?.firstname || "Ism yo‘q"} {c.user?.lastname || ""}</strong>
                <p>{c.text}</p>
              </div>
            ))
          ) : (
            <p>Hozircha izohlar yo‘q.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
