import { theme } from "../../theme/theme";

export default function Card({ children }) {
  return (
    <div
      style={{
        background: theme.colors.surface,
        padding: 25,
        borderRadius: theme.borderRadius.card,
        marginBottom: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}
    >
      {children}
    </div>
  );
}