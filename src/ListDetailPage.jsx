// src/ListDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListHeader from "./components/ListHeader";
import MembersSection from "./components/MembersSection";
import ItemsSection from "./components/ItemsSection";
import * as listApi from "./services/listApi";

const CURRENT_USER_ID = "user-2";

export default function ListDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [members, setMembers] = useState([]);
  const [items, setItems] = useState([]);
  const [showResolved, setShowResolved] = useState(false);

  const [status, setStatus] = useState("pending"); // pending | ready | error
  const [error, setError] = useState(null);
  const [ownerId, setOwnerId] = useState(null);

  const isOwner = ownerId === CURRENT_USER_ID;
  const currentUser = members.find((m) => m.id === CURRENT_USER_ID);

  // ---- načtení dat ze "serveru" podle id ----
  useEffect(() => {
    let cancelled = false;
    setStatus("pending");
    setError(null);

    listApi
      .getListById(id)
      .then((data) => {
        if (cancelled) return;
        setTitle(data.title);
        setMembers(data.members || []);
        setItems(data.items || []);
        setOwnerId(data.ownerId);
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

  // ---- název seznamu (jen owner) ----
  const handleRename = (newTitle) => {
    if (!isOwner) return;
    setTitle(newTitle);
    // pro tento úkol stačí lokálně – ukládání na server není nutné
  };

  // ---- členové ----
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

  // ---- položky ----
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

  const visibleItems = items.filter(
    (item) => showResolved || !item.resolved
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {status === "pending" && (
          <p style={styles.info}>Načítám detail nákupního seznamu…</p>
        )}

        {status === "error" && (
          <>
            <p style={styles.error}>
              Nastala chyba při načítání detailu: {error?.message}
            </p>
            <button
              style={styles.backButton}
              onClick={() => navigate("/lists")}
            >
              Zpět na přehled
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

            <div style={styles.columns}>
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
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#f4f4f5",
    minHeight: "100vh",
    padding: 24,
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
  info: {
    color: "#4b5563",
  },
  error: {
    color: "#b91c1c",
    marginBottom: 12,
  },
  backButton: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #d4d4d8",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
};
