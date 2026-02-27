import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

export default function CompanyInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("CompanyInternships mounted. Path:", window.location.pathname);

    api.get("/Company/internships")
      .then((res) => {
        console.log("API /Company/internships ->", res.data);
        setInternships(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log("API error:", err?.response?.status, err?.response?.data);
        setErrMsg(err?.response?.data || "İlanlar alınamadı");
        setInternships([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <p>Yükleniyor...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>İlanlarım</h2>
        <Button onClick={() => navigate("/company/create-internship")}>
          + Yeni İlan
        </Button>
      </div>

      {errMsg && (
        <Card>
          <p style={{ margin: 0, color: "#ef4444" }}>{errMsg}</p>
        </Card>
      )}

      {internships.length === 0 ? (
        <Card>
          <p style={{ margin: 0, opacity: 0.8 }}>Henüz ilanınız yok.</p>
        </Card>
      ) : (
        internships.map((item) => (
          <Card key={item.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <h3 style={{ margin: 0, marginBottom: 8 }}>{item.title}</h3>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Badge text={item.city} type="primary" />
                  <Badge text={item.isRemote ? "Remote" : "Ofis"} />
                  {item.salary != null && <Badge text={`${item.salary} TL`} type="success" />}
                  {item.applicationDeadline && (
                    <Badge text={`Son Gün: ${String(item.applicationDeadline).substring(0, 10)}`} type="warning" />
                  )}
                </div>
              </div>

              <Button onClick={() => navigate(`/internships/${item.id}`)}>
                Detay
              </Button>
            </div>
          </Card>
        ))
      )}
    </PageContainer>
  );
}