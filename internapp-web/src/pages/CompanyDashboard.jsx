import { useEffect, useState } from "react";
import api from "../api/api";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useNavigate } from "react-router-dom";

export default function CompanyDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const internshipsRes = await api.get("/Internships/company");
        const applicationsRes = await api.get("/Company/applications");

        const internships = internshipsRes.data;
        const applications = applicationsRes.data;

        setData({
          totalInternships: internships.length,
          totalApplications: applications.length,
          pending: applications.filter(a => a.status === "Pending").length,
          accepted: applications.filter(a => a.status === "Accepted").length,
          rejected: applications.filter(a => a.status === "Rejected").length,
          recentApplications: applications.slice(0, 5)
        });

      } catch {
        setData({
          totalInternships: 0,
          totalApplications: 0,
          pending: 0,
          accepted: 0,
          rejected: 0,
          recentApplications: []
        });
      }
    };

    loadData();
  }, []);

  if (!data) {
    return (
      <PageContainer>
        <p>Yükleniyor...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>

      {/* HEADER */}
      <div style={headerStyle}>
        <div>
          <h2 style={{ fontSize: 28 }}>Şirket Paneli</h2>
          <p style={{ opacity: 0.6 }}>İlanlarını ve başvurularını buradan yönetebilirsin</p>
        </div>

        <button
          style={primaryButton}
          onClick={() => navigate("/company/create-internship")}
        >
          + Yeni İlan
        </button>
      </div>

      {/* STATS */}
      <div style={statsGrid}>
        <StatCard title="Toplam İlan" value={data.totalInternships} />
        <StatCard title="Toplam Başvuru" value={data.totalApplications} />
        <StatCard title="Pending" value={data.pending} color="#facc15" />
        <StatCard title="Accepted" value={data.accepted} color="#22c55e" />
        <StatCard title="Rejected" value={data.rejected} color="#ef4444" />
      </div>

      {/* RECENT */}
      <h3 style={{ marginTop: 60, marginBottom: 20 }}>
        Son Başvurular
      </h3>

      {data.recentApplications.length === 0 ? (
        <Card>
          <p>Henüz başvuru yok.</p>
        </Card>
      ) : (
        data.recentApplications.map(app => (
          <div key={app.id} style={applicationCard}>
            <div>
              <h4 style={{ marginBottom: 5 }}>{app.studentName}</h4>
              <p style={{ opacity: 0.6 }}>{app.internshipTitle}</p>
            </div>

            <Badge
              text={app.status}
              type={
                app.status === "Accepted"
                  ? "success"
                  : app.status === "Rejected"
                  ? "danger"
                  : "warning"
              }
            />
          </div>
        ))
      )}

    </PageContainer>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div style={{
      background: "linear-gradient(135deg,#1e293b,#0f172a)",
      padding: 25,
      borderRadius: 16,
      boxShadow: "0 0 30px rgba(56,189,248,0.08)",
      transition: "0.3s"
    }}>
      <h4 style={{ opacity: 0.6 }}>{title}</h4>
      <h2 style={{ fontSize: 36, marginTop: 10, color: color || "#38bdf8" }}>
        {value}
      </h2>
    </div>
  );
}

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 40
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 25
};

const primaryButton = {
  padding: "12px 22px",
  background: "#38bdf8",
  border: "none",
  borderRadius: 12,
  fontWeight: 600,
  cursor: "pointer",
  color: "#0f172a",
  boxShadow: "0 10px 30px rgba(56,189,248,0.3)"
};

const applicationCard = {
  background: "rgba(255,255,255,0.03)",
  padding: 20,
  borderRadius: 14,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 15,
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.05)"
};