import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function InternshipDetail() {
  const { id } = useParams();
  const { roleValue, isAuth } = useAuth();

  const [internship, setInternship] = useState(null);
  const [message, setMessage] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [justApplied, setJustApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/Internships/${id}`);
        setInternship(res.data);

        // Eğer öğrenci girişliyse başvuru kontrolü yap
        if (isAuth && roleValue === "User") {
          const myApps = await api.get("/Applications/my");

          if (Array.isArray(myApps.data)) {
            const exists = myApps.data.some(
              (a) => Number(a.internshipId) === Number(id)
            );
            setAlreadyApplied(exists);
          }
        }
      } catch (err) {
        setMessage(err.response?.data || "İlan bulunamadı");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuth, roleValue]);

  const apply = async () => {
    if (applying) return; // double click engeli

    try {
      setApplying(true);
      setMessage("");

      await api.post(`/Applications/${id}`);

      setMessage("Başvurunuz başarı ile gerçekleşmiştir.");
      setAlreadyApplied(true);
      setJustApplied(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setMessage("Bu ilana zaten başvurdunuz.");
        setAlreadyApplied(true);
      } else {
        setMessage(err.response?.data || "Başvuru başarısız");
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p style={{ padding: 60 }}>Yükleniyor...</p>;
  if (!internship) return <p style={{ padding: 60 }}>{message}</p>;

  const deadlinePassed =
    internship.applicationDeadline &&
    new Date(internship.applicationDeadline) < new Date();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "80px 20px",
        color: "#e2e8f0"
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "#1e293b",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
        }}
      >
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          {internship.title}
        </h1>

        <p style={{ opacity: 0.7, marginBottom: "20px" }}>
          {internship.companyName}
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
            flexWrap: "wrap"
          }}
        >
          <Badge text={internship.city} />
          <Badge text={internship.isRemote ? "Remote" : "Ofis"} />
          {internship.salary && (
            <Badge text={`${internship.salary} TL`} />
          )}
        </div>

        <p style={{ lineHeight: 1.7, marginBottom: "30px" }}>
          {internship.description}
        </p>

        {internship.applicationDeadline && (
          <p
            style={{
              marginBottom: "20px",
              color: deadlinePassed ? "#ef4444" : "#38bdf8"
            }}
          >
            ⏳ Son Başvuru:{" "}
            {internship.applicationDeadline.substring(0, 10)}
          </p>
        )}

        {/* STUDENT ACTION AREA */}
        {roleValue === "User" && (
          <>
            {deadlinePassed ? (
              <StatusBox
                text="Başvuru süresi dolmuş"
                color="#ef4444"
              />
            ) : justApplied ? (
              <StatusBox
                text="Başvurunuz başarı ile gerçekleşmiştir."
                color="#22c55e"
              />
            ) : alreadyApplied ? (
              <StatusBox
                text="Bu ilana zaten başvurdun"
                color="#22c55e"
              />
            ) : (
              <button
                onClick={apply}
                disabled={applying}
                style={{
                  padding: "14px 28px",
                  background:
                    "linear-gradient(90deg,#38bdf8,#0ea5e9)",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "15px",
                  cursor: applying ? "not-allowed" : "pointer",
                  color: "#0f172a",
                  opacity: applying ? 0.7 : 1
                }}
              >
                {applying ? "Başvuruluyor..." : "Başvur"}
              </button>
            )}
          </>
        )}

        {message && !justApplied && (
          <p style={{ marginTop: 20, color: "#38bdf8" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

function Badge({ text }) {
  return (
    <span
      style={{
        background: "#334155",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "13px"
      }}
    >
      {text}
    </span>
  );
}

function StatusBox({ text, color }) {
  return (
    <div
      style={{
        padding: "12px 20px",
        borderRadius: "8px",
        background: color + "20",
        color,
        fontWeight: 500
      }}
    >
      {text}
    </div>
  );
}