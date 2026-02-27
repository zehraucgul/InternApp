import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch {
      alert("Giriş başarısız");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>Tekrar Hoşgeldin</h2>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <input
            style={input}
            type="email"
            placeholder="Email adresin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={input}
            type="password"
            placeholder="Şifren"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={button}>Giriş Yap</button>
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
  width: "380px",
  padding: "40px",
  borderRadius: "20px",
  backdropFilter: "blur(20px)",
  background: "rgba(255,255,255,0.05)",
  boxShadow: "0 0 40px rgba(56,189,248,0.2)",
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
  marginBottom: "20px",
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
