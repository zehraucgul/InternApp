import { useState } from "react";
import api from "../api/api";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function CreateCompany() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: ""
  });

  const submit = async () => {
    await api.post("/Company", form);
    window.location.href = "/company/dashboard";
  };

  return (
    <PageContainer>
      <Card>
        <h2>Şirket Oluştur</h2>

        <input
          placeholder="Şirket Adı"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
        />

        <input
          placeholder="Konum"
          value={form.location}
          onChange={e => setForm({...form, location: e.target.value})}
        />

        <textarea
          placeholder="Açıklama"
          value={form.description}
          onChange={e => setForm({...form, description: e.target.value})}
        />

        <Button onClick={submit}>Oluştur</Button>
      </Card>
    </PageContainer>
  );
}