import { theme } from "../../theme/theme";

export default function Badge({ text, type = "warning" }) {
  const color =
    type === "success"
      ? theme.colors.success
      : type === "danger"
      ? theme.colors.danger
      : type === "primary"
      ? theme.colors.primary
      : theme.colors.warning;

  return (
    <span
      style={{
        padding: "6px 14px",
        borderRadius: 20,
        background: color + "20",
        color,
        fontWeight: 600,
        fontSize: 13
      }}
    >
      {text}
    </span>
  );
}