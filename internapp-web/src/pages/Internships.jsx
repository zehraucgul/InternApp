import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sort, setSort] = useState("new");

  const navigate = useNavigate();

  // 🔥 GENEL İLANLAR BURADAN GELİR
  useEffect(() => {
    api.get("/Internships")
      .then(res => setInternships(res.data))
      .catch(() => alert("İlanlar yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  const cities = useMemo(() => {
    const unique = [...new Set(internships.map(i => i.city))];
    return unique.filter(Boolean);
  }, [internships]);

  const filtered = useMemo(() => {
    let data = [...internships];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.companyName?.toLowerCase().includes(q)
      );
    }

    if (cityFilter) {
      data = data.filter(i => i.city === cityFilter);
    }

    if (remoteOnly) {
      data = data.filter(i => i.isRemote);
    }

    if (sort === "new") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sort === "salary") {
      data.sort((a, b) => (b.salary || 0) - (a.salary || 0));
    }

    return data;
  }, [internships, search, cityFilter, remoteOnly, sort]);

  if (loading) {
    return (
      <PageContainer>
        <p>Yükleniyor...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h2 style={{ marginBottom: 30 }}>Staj İlanları</h2>

      {/* FILTER BAR */}
      <div style={{
        display: "flex",
        gap: 12,
        marginBottom: 30,
        flexWrap: "wrap"
      }}>
        <input
          placeholder="Ara (başlık / şirket)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="">Tüm Şehirler</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={inputStyle}
        >
          <option value="new">En Yeni</option>
          <option value="salary">Maaşa Göre</option>
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={() => setRemoteOnly(!remoteOnly)}
          />
          Sadece Remote
        </label>
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <Card>
          <p>Sonuç bulunamadı.</p>
        </Card>
      ) : (
        filtered.map(item => (
          <InternshipCard
            key={item.id}
            item={item}
            onClick={() => navigate(`/internships/${item.id}`)}
          />
        ))
      )}
    </PageContainer>
  );
}

function InternshipCard({ item, onClick }) {
  const deadlinePassed =
    item.applicationDeadline &&
    new Date(item.applicationDeadline) < new Date();

  return (
    <Card>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start"
      }}>
        <div>
          <h3 style={{ marginBottom: 6 }}>{item.title}</h3>
          <p style={{ opacity: 0.6, marginBottom: 12 }}>
            {item.companyName}
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Badge text={item.city} type="primary" />
            <Badge text={item.isRemote ? "Remote" : "Ofis"} />
            {item.salary && (
              <Badge text={`${item.salary} TL`} type="success" />
            )}
            {item.applicationDeadline && (
              <Badge
                text={
                  deadlinePassed
                    ? "Süre Doldu"
                    : "Son Gün: " + item.applicationDeadline.substring(0, 10)
                }
                type={deadlinePassed ? "danger" : "warning"}
              />
            )}
          </div>
        </div>

        <Button onClick={onClick}>
          Detay
        </Button>
      </div>
    </Card>
  );
}

const inputStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#e2e8f0"
};