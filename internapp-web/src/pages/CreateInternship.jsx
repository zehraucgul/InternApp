import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CreateInternship() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    isRemote: false,
    salary: "",
    applicationDeadline: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/Internships", {
        title: form.title,
        description: form.description,
        city: form.city,
        isRemote: form.isRemote,
        salary: form.salary ? Number(form.salary) : 0,
        applicationDeadline: new Date(form.applicationDeadline).toISOString()
      });

      alert("İlan başarıyla oluşturuldu 🚀");
      navigate("/company/dashboard");

    } catch (err) {
      console.log("Backend error:", err.response?.data);
      alert("Bir hata oluştu");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>Yeni İlan Oluştur 🚀</h2>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>

          <input
            style={input}
            name="title"
            placeholder="İlan Başlığı"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            style={{ ...input, height: "100px" }}
            name="description"
            placeholder="İlan Açıklaması"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            style={input}
            name="city"
            placeholder="Şehir"
            value={form.city}
            onChange={handleChange}
            required
          />

          <input
            style={input}
            type="number"
            name="salary"
            placeholder="Maaş"
            value={form.salary}
            onChange={handleChange}
          />

          <input
            style={input}
            type="date"
            name="applicationDeadline"
            value={form.applicationDeadline}
            onChange={handleChange}
            required
          />

          <label style={{ marginBottom: "15px" }}>
            <input
              type="checkbox"
              name="isRemote"
              checked={form.isRemote}
              onChange={handleChange}
            />
            &nbsp; Remote
          </label>

          <button style={button}>
            İlanı Yayınla
          </button>

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
  width: "500px",
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
