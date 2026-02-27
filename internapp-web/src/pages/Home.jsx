import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuth } = useAuth();

  return (
    <div style={{padding:"100px 60px", textAlign:"center"}}>

      <h1 style={{
        fontSize:"64px",
        fontWeight:"900",
        marginBottom:"20px",
        background:"linear-gradient(to right,#38bdf8,#818cf8)",
        WebkitBackgroundClip:"text",
        WebkitTextFillColor:"transparent"
      }}>
        Geleceğini İnşa Et.
      </h1>

      <p style={{
        fontSize:"20px",
        color:"#cbd5e1",
        marginBottom:"40px"
      }}>
        En iyi şirketlerle bağlantı kur. Staj başvurularını tek yerden yönet.
      </p>

      {!isAuth && (
        <div style={{display:"flex", justifyContent:"center", gap:"20px"}}>
          <Link to="/register"
            style={{
              background:"#38bdf8",
              padding:"14px 28px",
              borderRadius:"10px",
              color:"#0f172a",
              fontWeight:"600"
            }}>
            Hemen Başla
          </Link>

          <Link to="/login"
            style={{
              border:"1px solid #38bdf8",
              padding:"14px 28px",
              borderRadius:"10px",
              color:"#38bdf8"
            }}>
            Giriş Yap
          </Link>
        </div>
      )}

      {isAuth && (
        <Link
          to="/internships"
          style={{
            background:"#818cf8",
            padding:"14px 28px",
            borderRadius:"10px",
            color:"white",
            fontWeight:"600"
          }}
        >
          İlanları Gör
        </Link>
      )}

    </div>
  );
}
