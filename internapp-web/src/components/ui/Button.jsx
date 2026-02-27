import { theme } from "../../theme/theme";

export default function Button({ children, color = "primary", onClick }) {
  const bg =
    color === "success"
      ? theme.colors.success
      : color === "danger"
      ? theme.colors.danger
      : theme.colors.primary;

  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 22px",
        borderRadius: theme.borderRadius.button,
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
        background: bg,
        color: "#0f172a",
        transition: "0.2s ease"
      }}
    >
      {children}
    </button>
  );
}