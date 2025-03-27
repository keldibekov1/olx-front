import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    status: "",
    from: "",
    to: "",
  });
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    setLoading(true);

    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append("categoryId", filters.category);
    if (filters.color) queryParams.append("colorId", filters.color);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.from) queryParams.append("minPrice", filters.from);
    if (filters.to) queryParams.append("maxPrice", filters.to);
    if (sort) queryParams.append("sortBy", sort);

    axios
      .get(`https://keldibekov.online/products?${queryParams.toString()}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          throw new Error("API noto‘g‘ri formatda ma’lumot qaytardi!");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Ma'lumotni olishda xatolik!");
        setLoading(false);
      });
  }, [filters, sort]);

  // Kategoriyalar va ranglarni olish
  useEffect(() => {
    axios.get("https://keldibekov.online/category")
      .then(res => setCategories(res.data))
      .catch(() => console.error("Kategoriyalarni olishda xatolik"));

    axios.get("https://keldibekov.online/color")
      .then(res => setColors(res.data))
      .catch(() => console.error("Ranglarni olishda xatolik"));
  }, []);

  if (loading) return <h2 style={{ textAlign: "center" }}>Yuklanmoqda...</h2>;
  if (error) return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {/* Search & Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
        <input type="text" placeholder="Search..." style={{ flex: "1", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
        
        <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        
        <select onChange={(e) => setFilters({ ...filters, color: e.target.value })}>
          <option value="">Color</option>
          {colors.map((col) => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "39px", 
          justifyContent: "center"
        }}
      >
        {currentProducts.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} style={{ textDecoration: "none", color: "inherit" }}>
            <div 
              style={{
                background: "#f5f5f5",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.2s",
                cursor: "pointer",
                maxWidth: "350px",
                margin: "auto"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <img 
                src={product.img || "https://via.placeholder.com/350"} 
                alt={product.name} 
                style={{ 
                  width: "100%", 
                  height: "299px", 
                  objectFit: "cover",
                  background: "#f8f8f8"
                }} 
              />

              <div style={{ padding: "30px", textAlign: "center" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
                  {product.name}
                </h3>
                <p style={{ color: "#777", fontSize: "16px" }}>
                  {product.category?.name || "Kategoriya yo'q"}
                </p>
                <p style={{ fontSize: "22px", fontWeight: "bold", color: "#333", marginBottom: "5px" }}>
                  ${product.price}
                </p>

                <div style={{ color: "#FFD700", fontSize: "18px", marginBottom: "10px" }}>
                  {"★".repeat(Math.floor(product.avgStars || 4))} 
                  {product.avgStars % 1 >= 0.5 && "⯨"} 
                  <span style={{ color: "#555", fontSize: "14px" }}>
                    ({product.avgStars || 4.0})
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                  <button 
                    style={{
                      background: "#4F959D",
                      color: "white",
                      border: "none",
                      padding: "12px 25px",
                      borderRadius: "15%",
                      cursor: "pointer",
                      fontSize: "13px"
                    }}
                  >
                    Buy
                  </button>
                  <button 
                    style={{
                      background: "#4F959D",
                      color: "white",
                      border: "none",
                      padding: "12px",
                      borderRadius: "30%",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    🛒
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map((num) => (
          <button 
            key={num + 1}
            onClick={() => setCurrentPage(num + 1)}
            style={{
              padding: "10px",
              margin: "5px",
              background: currentPage === num + 1 ? "#2196F3" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
