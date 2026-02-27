import { useEffect, useState } from "react";
import api from "../api/api";

import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

export default function Profile() {
  const [profile, setProfile] = useState({});       // ✅ null değil
  const [profileExists, setProfileExists] = useState(false); // ✅ create/update ayrımı
  const [account, setAccount] = useState(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  // ACCOUNT INFO
  useEffect(() => {
    api.get("/Users/me")
      .then(res => setAccount(res.data))
      .catch(() => {});
  }, []);

  // PROFILE INFO
  useEffect(() => {
    api.get("/Profile")
      .then(res => {
        setProfile(res.data || {});
        setProfileExists(true);
      })
      .catch(err => {
        // ✅ Profil yoksa backend "Profil henüz oluşturulmamış" diye 404 dönüyor
        if (err.response?.status === 404) {
          setProfile({});
          setProfileExists(false);
        } else {
          setError(err.response?.data || "Profil yüklenemedi");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const saveProfile = async () => {
    try {
      setError("");

      // ✅ Profil yoksa POST ile oluştur, varsa PUT ile güncelle
      const res = profileExists
        ? await api.put("/Profile", profile)
        : await api.post("/Profile", profile);

      setProfile(res.data || {});
      setProfileExists(true);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data || "Profil kaydedilemedi");
    }
  };

  const updatePassword = async () => {
    try {
      await api.put("/Profile/password", passwordData);
      setShowPasswordBox(false);
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data || "Şifre güncellenemedi");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <p>Yükleniyor...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>

      {/* ================= HESAP BİLGİLERİ ================= */}
      {account && (
        <Card>
          <h3 style={{ marginBottom: 20 }}>Hesap Bilgileri</h3>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ opacity: 0.6 }}>Email</p>
              <p>{account.email}</p>
            </div>

            <Button onClick={() => setShowPasswordBox(!showPasswordBox)}>
              Şifre Değiştir
            </Button>
          </div>

          {showPasswordBox && (
            <div style={{ marginTop: 20 }}>
              <input
                type="password"
                placeholder="Mevcut Şifre"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                style={inputStyle}
              />

              <input
                type="password"
                placeholder="Yeni Şifre"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                style={{ ...inputStyle, marginTop: 10 }}
              />

              <div style={{ marginTop: 10 }}>
                <Button onClick={updatePassword}>Kaydet</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ================= PROFİL BİLGİLERİ ================= */}
      <Card style={{ marginTop: 30 }}>
        <h3 style={{ marginBottom: 20 }}>Profil Bilgileri</h3>

        {/* ✅ Hata mesajı */}
        {error && (
          <p style={{ marginBottom: 15, color: "#ef4444" }}>
            {String(error)}
          </p>
        )}

        {!editing ? (
          <>
            <ProfileRow label="Üniversite" value={profile.university} />
            <ProfileRow label="Bölüm" value={profile.department} />
            <ProfileRow label="Sınıf" value={profile.classYear} />

            {/* ✅ split güvenli */}
            {profile.skills ? (
              <>
                <h4 style={{ marginTop: 20 }}>Yetenekler</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {String(profile.skills)
                    .split(",")
                    .map((skill, index) => (
                      <Badge key={index} text={skill.trim()} type="primary" />
                    ))}
                </div>
              </>
            ) : null}

            {profile.bio ? (
              <>
                <h4 style={{ marginTop: 20 }}>Hakkımda</h4>
                <p style={{ opacity: 0.7 }}>{profile.bio}</p>
              </>
            ) : null}

            {profile.linkedInUrl ? (
              <ProfileRow label="LinkedIn" value={profile.linkedInUrl} />
            ) : null}

            {profile.githubUrl ? (
              <ProfileRow label="GitHub" value={profile.githubUrl} />
            ) : null}

            <div style={{ marginTop: 30 }}>
              <Button onClick={() => setEditing(true)}>
                {profileExists ? "Profili Düzenle" : "Profil Oluştur"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Input label="Üniversite" name="university" value={profile.university || ""} onChange={handleChange} />
            <Input label="Bölüm" name="department" value={profile.department || ""} onChange={handleChange} />
            <Input label="Sınıf" name="classYear" value={profile.classYear || ""} onChange={handleChange} />
            <Input label="Yetenekler (virgül ile)" name="skills" value={profile.skills || ""} onChange={handleChange} />
            <Input label="LinkedIn" name="linkedInUrl" value={profile.linkedInUrl || ""} onChange={handleChange} />
            <Input label="GitHub" name="githubUrl" value={profile.githubUrl || ""} onChange={handleChange} />

            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              placeholder="Kendinden bahset..."
              style={textareaStyle}
            />

            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <Button onClick={saveProfile}>Kaydet</Button>
              <Button onClick={() => setEditing(false)} variant="secondary">
                İptal
              </Button>
            </div>
          </>
        )}
      </Card>

    </PageContainer>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ opacity: 0.6 }}>{label}</p>
      <p>{value || "-"}</p>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <label style={{ opacity: 0.6 }}>{label}</label>
      <input {...props} style={inputStyle} />
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  marginTop: 6,
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#e2e8f0"
};

const textareaStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#e2e8f0",
  marginTop: 10,
  minHeight: 100
};