import { useEffect, useState } from "react";
import api from "../api/api";

import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

export default function CompanyApplications() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/Company/applications");
      setApplications(res.data);
    } catch (err) {
      console.log("Fetch applications error:", err.response?.data || err.message);
      alert("Başvurular yüklenemedi.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (applicationId, status) => {
    try {
      await api.put(`/Applications/${applicationId}/status`, { status });

      // UI anında güncellensin
      setApplications((prev) =>
        prev.map((a) =>
          a.applicationId === applicationId ? { ...a, status } : a
        )
      );
    } catch (err) {
      console.log("Update status error:", err.response?.data || err.message);
      alert(err.response?.data || "Durum güncellenemedi.");
    }
  };

  return (
    <PageContainer>
      <h2 style={{ marginBottom: 30 }}>Gelen Başvurular</h2>

      {applications.map((app) => (
        <Card key={app.applicationId}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              alignItems: "flex-start"
            }}
          >
            <div>
              <h3 style={{ marginBottom: 6 }}>{app.studentName}</h3>
              <p style={{ opacity: 0.6, marginTop: 0 }}>{app.studentEmail}</p>
              <p style={{ marginTop: 10 }}>{app.internshipTitle}</p>

              {app.status === "Pending" && (
                <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                  <Button
                    color="success"
                    onClick={() => updateStatus(app.applicationId, "Accepted")}
                  >
                    Kabul Et
                  </Button>

                  <Button
                    color="danger"
                    onClick={() => updateStatus(app.applicationId, "Rejected")}
                  >
                    Reddet
                  </Button>
                </div>
              )}
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
        </Card>
      ))}
    </PageContainer>
  );
}