// src/app/AppProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const translations = {
  cs: {
    appTitle: "Nákupní seznamy",
    createNew: "+ Nový seznam",
    showArchived: "Zobrazit včetně archivovaných",
    loadingLists: "Načítám nákupní seznamy…",
    loadingDetail: "Načítám detail nákupního seznamu…",
    loadError: "Nastala chyba při načítání dat:",
    back: "Zpět",
    delete: "Smazat",
    archived: "Archivováno",
    onlyOwnerDelete: "Seznam může smazat pouze vlastník.",
    archivedCantDelete: "Archivovaný seznam není možné mazat.",
    stats: "Statistika",
    resolved: "Vyřešené",
    open: "Nevyřešené",
    itemsCount: "Počet položek",
    theme: "Motiv",
    light: "Light",
    dark: "Dark",
    language: "Jazyk",
    listOverviewChartTitle: "Přehled seznamů podle počtu položek",
    detailChartTitle: "Stav položek",
  },
  en: {
    appTitle: "Shopping lists",
    createNew: "+ New list",
    showArchived: "Show archived as well",
    loadingLists: "Loading shopping lists…",
    loadingDetail: "Loading shopping list detail…",
    loadError: "Error while loading data:",
    back: "Back",
    delete: "Delete",
    archived: "Archived",
    onlyOwnerDelete: "Only the owner can delete this list.",
    archivedCantDelete: "Archived list cannot be deleted.",
    stats: "Stats",
    resolved: "Resolved",
    open: "Open",
    itemsCount: "Items count",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    language: "Language",
    listOverviewChartTitle: "Lists overview by item count",
    detailChartTitle: "Items status",
  },
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "cs");

  useEffect(() => localStorage.setItem("theme", theme), [theme]);
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const t = useMemo(() => {
    const dict = translations[lang] || translations.cs;
    return (key) => dict[key] ?? key;
  }, [lang]);

  const value = useMemo(
    () => ({ theme, setTheme, lang, setLang, t }),
    [theme, lang, t]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
