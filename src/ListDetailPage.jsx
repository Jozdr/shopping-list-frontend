// src/ListDetailPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";

import ListHeader from "./components/ListHeader";
import MembersSection from "./components/MembersSection";
import ItemsSection from "./components/ItemsSection";

import * as listApi from "./services/listApi";
import { useApp } from "./app/AppProvider";

const CURRENT_USER_ID = "user-2";

export default function ListDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useApp();

  const [title, setTitle] = useState("");
  const [members, setMembers] = useState([]);
  const [items, setItems] = useState([]);
  const [showResolved, setShowResolved] = useState(false);

  const [status, setStatus] = useState("pending"); 
  const [error, setError] = useState(null);
  const [ownerId, setOwnerId] = useState(null);

  const isOwner = ownerId === CURRENT_USER_ID;
  const currentUser = members.find((m) => m.id === CURRENT_USER_ID);

  useEffect(() => {
    let cancelled = false;

    setStatus("pending");
    setError(null);

    listApi
      .getListById(id)
      .then((data) => {
        if (cancelled) return;

        setTitle(data?.title || "");
        setMembers(data?.members || []);
        setItems(data?.items || []);
        setOwnerId(data?.ownerId || null);

        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError(err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const pieData = useMemo(() => {
    const resolvedCount = items.filter((item) => item.resolved).length;
    const openCount = items.length - resolvedCount;

    return [
      { name: t("open"), value: openCount },
      { name: t("resolved"), value: resolvedCount },
    ];
  }, [items, t]);

  const handleRename = (newTitle) => {
    if (!isOwner) return;
    setTitle(newTitle);
  };

  const handleAddMember = (nameOrEmail) => {
    if (!isOwner) return;
    if (!nameOrEmail.trim()) return;

    const newMember = {
      id: `user-${Date.now()}`,
      name: nameOrEmail.trim(),
      role: "member",
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const handleRemoveMember = (memberId) => {
    if (!isOwner) return;
    if (memberId === ownerId) {
      alert("Vlastníka nelze odebrat."); 
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleLeave = () => {
    if (!currentUser) return;
    if (currentUser.id === ownerId) {
      alert("Vlastník nemůže odejít ze seznamu.");
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== CURRENT_USER_ID));
  };

  const handleToggleResolved = (itemId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, resolved: !item.resolved } : item
      )
    );
  };

  const handleDeleteItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleAddItem = (name) => {
    if (!name.trim()) return;
    const newItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      resolved: false,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const visibleItems = items.filter((item) => showResolved || !item.resolved);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {status === "pending" && <p style={styles.info}>{t("loadingDetail")}</p>}

        {status === "error" && (
          <>
            <p style={styles.error}>
              {t("loadError")} {error?.message}
            </p>
            <button style={styles.backButton} onClick={() => navigate("/lists")}>
              {t("back")}
            </button>
          </>
        )}

        {status === "ready" && (
          <>
            <ListHeader
              title={title}
              isOwner={isOwner}
              onRename={handleRename}
              onBack={() => navigate("/lists")}
            />

            <div style={styles.statsCard}>
              <h3 style={{ margin: 0 }}>{t("detailChartTitle")}</h3>

              <div style={{ height: 220, marginTop: 8 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                     data={pieData}
                     dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                    >
                      {pieData.map((entry, index) => (
                      <Cell
                      key={`cell-${index}`}
                       fill={entry.name === t("resolved") ? "#2563eb" : "#dc2626"}
                      />
                          ))}
                      </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Content */}
            <div className="detailColumns" style={styles.columns}>
              <ItemsSection
                items={visibleItems}
                allItems={items}
                showResolved={showResolved}
                setShowResolved={setShowResolved}
                onToggleResolved={handleToggleResolved}
                onDelete={handleDeleteItem}
                onAdd={handleAddItem}
              />

              <MembersSection
                members={members}
                isOwner={isOwner}
                currentUserId={CURRENT_USER_ID}
                onAdd={handleAddMember}
                onRemove={handleRemoveMember}
                onLeave={handleLeave}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "var(--bg)",
    minHeight: "100vh",
    padding: 24,
    color: "var(--text)",
  },
  container: {
    maxWidth: 960,
    margin: "0 auto",
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 16,
    marginTop: 16,
  },
  statsCard: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  info: {
    color: "var(--muted)",
  },
  error: {
    color: "var(--danger)",
    marginBottom: 12,
  },
  backButton: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    backgroundColor: "var(--card)",
    color: "var(--text)",
    cursor: "pointer",
  },
};
