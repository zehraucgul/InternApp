import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>Hoşgeldin 👋</p>

      {user && (
        <>
          <p>Email: {user.email}</p>
          <p>Rol: {user.role}</p>
        </>
      )}
    </div>
  );
}
