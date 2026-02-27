import { useEffect, useState } from "react";
import api from "../api/api";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/Applications/my")
      .then(res => setApplications(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div style={pageStyle}>Yükleniyor...</div>;

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h2 style={{ marginBottom: 30 }}>Başvurularım</h2>

        {applications.length === 0 ? (
          <EmptyState />
        ) : (
          applications.map(app => (
            <ApplicationCard key={app.id} app={app} />
          ))
        )}
      </div>
    </div>
  );
}

function ApplicationCard({ app }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ marginBottom: 6 }}>{app.internshipTitle}</h3>
          <p style={{ opacity: 0.6 }}>
            {app.companyName} • {app.city}
          </p>
        </div>

        <StatusBadge status={app.status} />
      </div>

      <div style={{
        marginTop: 15,
        fontSize: 14,
        opacity: 0.7
      }}>
        Başvuru Tarihi: {app.appliedDate?.substring(0, 10)}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  let color = "#f59e0b"; // pending

  if (status === "Accepted") color = "#22c55e";
  if (status === "Rejected") color = "#ef4444";

  return (
    <span style={{
      padding: "6px 14px",
      borderRadius: "20px",
      background: color + "20",
      color,
      fontWeight: 600,
      fontSize: 13
    }}>
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div style={{
      padding: "40px",
      textAlign: "center",
      background: "#1e293b",
      borderRadius: 12
    }}>
      Henüz başvuru yapmadın.
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#0f172a",
  padding: "80px 20px",
  color: "#e2e8f0"
};

const containerStyle = {
  maxWidth: 900,
  margin: "auto"
};

const cardStyle = {
  background: "#1e293b",
  padding: 25,
  borderRadius: 14,
  marginBottom: 20,
  transition: "0.2s ease",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
};