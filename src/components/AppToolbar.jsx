import React from "react";
import { useApp } from "../app/AppProvider";

export default function AppToolbar() {
  const { theme, setTheme, lang, setLang, t } = useApp();

  return (
    <div style={styles.bar}>
      <div style={styles.controls}>
        <label style={styles.label}>
          {t("theme")}:
          <select
            style={styles.select}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">{t("light")}</option>
            <option value="dark">{t("dark")}</option>
          </select>
        </label>

        <label style={styles.label}>
          {t("language")}:
          <select
            style={styles.select}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="cs">Česky</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>
    </div>
  );
}

const styles = {
  bar: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "var(--card)",
    borderBottom: "1px solid var(--border)",
    padding: "10px 16px",
    display: "flex",
    justifyContent: "flex-end",
  },
  controls: { display: "flex", gap: 12, alignItems: "center" },
  label: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "var(--muted)",
    fontSize: 14,
  },
  select: {
    padding: "6px 8px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
  },
};
