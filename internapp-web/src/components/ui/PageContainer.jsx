import { theme } from "../../theme/theme";

export default function PageContainer({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        padding: theme.spacing.pagePadding,
        color: theme.colors.text
      }}
    >
      <div
        style={{
          maxWidth: theme.spacing.containerWidth,
          margin: "auto"
        }}
      >
        {children}
      </div>
    </div>
  );
}