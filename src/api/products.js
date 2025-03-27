const API_URL = "https://keldibekov.online";

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token"); // ✅ Tokenni olish

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // ✅ Token qo‘shish
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Xatolik yuz berdi!");
  }

  return data;
};
