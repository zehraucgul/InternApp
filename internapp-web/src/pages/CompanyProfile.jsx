import { useEffect, useState } from "react";
import api from "../api/api";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await api.get("/Company/my");
      setCompany(res.data);
    } catch (err) {
      console.log(err);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const save = async () => {
    try {
      await api.put("/Company", company);
      setEditing(false);
      fetchCompany();
    } catch (err) {
      console.log(err);
      alert("Güncelleme sırasında hata oluştu.");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <p>Yükleniyor...</p>
      </PageContainer>
    );
  }

  if (!company) {
    return (
      <PageContainer>
        <Card style={{ textAlign: "center", padding: 50 }}>
          <h2>Henüz şirket profiliniz yok</h2>
          <p style={{ opacity: 0.6, marginBottom: 20 }}>
            İlan yayınlamak için önce şirket oluşturmalısınız.
          </p>
          <Button onClick={() => window.location = "/company/create"}>
            Şirket Oluştur
          </Button>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={pageWrapper}>

        {/* HEADER */}
        <Card style={headerStyle}>
          <div style={{ maxWidth: 600 }}>
            <h1 style={titleStyle}>{company.name}</h1>
            <p style={metaStyle}>📍 {company.location}</p>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                style={websiteStyle}
              >
                🔗 {company.website}
              </a>
            )}
          </div>

          {!editing && (
            <Button onClick={() => setEditing(true)}>
              Profili Düzenle
            </Button>
          )}
        </Card>

        {/* INFO */}
        {!editing && (
          <Card style={sectionCard}>
            <h3 style={sectionTitle}>Şirket Bilgileri</h3>

            <div style={gridStyle}>
              <InfoItem label="Şirket Adı" value={company.name} />
              <InfoItem label="Lokasyon" value={company.location} />
              <InfoItem label="Website" value={company.website || "Belirtilmemiş"} />
            </div>
          </Card>
        )}

        {/* ABOUT */}
        {!editing && (
          <Card style={sectionCard}>
            <h3 style={sectionTitle}>Hakkında</h3>
            <p style={aboutText}>
              {company.description || "Henüz açıklama girilmemiş."}
            </p>
          </Card>
        )}

        {/* EDIT MODE */}
        {editing && (
          <Card style={sectionCard}>
            <h3 style={sectionTitle}>Profili Düzenle</h3>

            <div style={formGroup}>
              <label>Şirket Adı</label>
              <input
                name="name"
                value={company.name || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={formGroup}>
              <label>Lokasyon</label>
              <input
                name="location"
                value={company.location || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={formGroup}>
              <label>Website</label>
              <input
                name="website"
                value={company.website || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={formGroup}>
              <label>Açıklama</label>
              <textarea
                name="description"
                value={company.description || ""}
                onChange={handleChange}
                style={textareaStyle}
              />
            </div>

            <div style={buttonRow}>
              <Button onClick={save}>Kaydet</Button>
              <Button onClick={() => setEditing(false)}>
                İptal
              </Button>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}

/* ------------------- Helper Component ------------------- */

function InfoItem({ label, value }) {
  return (
    <div>
      <p style={{ opacity: 0.5, fontSize: 13 }}>{label}</p>
      <p style={{ marginTop: 6 }}>{value}</p>
    </div>
  );
}

/* ------------------- Styles ------------------- */

const pageWrapper = {
  maxWidth: 1100,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 40
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "40px 48px",
  background: "linear-gradient(135deg,#1e293b,#0f172a)",
  borderRadius: 20
};

const sectionCard = {
  padding: "40px 48px",
  borderRadius: 20
};

const titleStyle = {
  margin: 0,
  fontSize: 32,
  fontWeight: 600
};

const metaStyle = {
  marginTop: 12,
  opacity: 0.7,
  fontSize: 15
};

const websiteStyle = {
  display: "inline-block",
  marginTop: 14,
  color: "#60a5fa",
  textDecoration: "none"
};

const sectionTitle = {
  marginBottom: 28,
  fontSize: 20,
  fontWeight: 600
};

const aboutText = {
  lineHeight: 1.8,
  opacity: 0.85
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 30
};

const formGroup = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  marginBottom: 24
};

const buttonRow = {
  display: "flex",
  gap: 16,
  marginTop: 10
};

const inputStyle = {
  padding: 14,
  borderRadius: 12,
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#e2e8f0"
};

const textareaStyle = {
  ...inputStyle,
  minHeight: 140
};