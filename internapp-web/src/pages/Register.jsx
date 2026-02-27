import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "User"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/Users/register", form);
      alert("Kayıt başarılı!");
      navigate("/login");
    } catch {
      alert("Kayıt başarısız");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>Hesap Oluştur</h2>

        <form onSubmit={handleRegister} style={{ width: "100%" }}>
          <input
            style={input}
            name="fullName"
            placeholder="Ad Soyad"
            value={form.fullName}
            onChange={handleChange}
          />

          <input
            style={input}
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            style={input}
            type="password"
            name="password"
            placeholder="Şifre"
            value={form.password}
            onChange={handleChange}
          />

          <select
            style={input}
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="User">Öğrenci</option>
            <option value="Company">Şirket</option>
          </select>

          <button style={button}>Kayıt Ol</button>
        </form>
      </div>
    </div>
  );
}

const container = {
  minHeight: "90vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const card = {
  width: "400px",
  padding: "40px",
  borderRadius: "20px",
  backdropFilter: "blur(20px)",
  background: "rgba(255,255,255,0.05)",
  boxShadow: "0 0 40px rgba(129,140,248,0.2)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const title = {
  fontSize: "28px",
  marginBottom: "30px"
};

const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  outline: "none"
};

const button = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(to right,#38bdf8,#818cf8)",
  color: "#0f172a",
  fontWeight: "700",
  cursor: "pointer"
};
