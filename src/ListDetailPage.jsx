// src/ListDetailPage.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListHeader from "./components/ListHeader";
import MembersSection from "./components/MembersSection";
import ItemsSection from "./components/ItemsSection";

const CURRENT_USER_ID = "user-2";

// „databáze“ seznamů – jen pro účely úkolu
const LISTS_DB = {
  "list-1": {
    id: "list-1",
    title: "Víkendový nákup",
    ownerId: "user-1",
    members: [
      { id: "user-1", name: "Jan", role: "owner" },
      { id: "user-2", name: "Eva", role: "member" },
      { id: "user-3", name: "Petr", role: "member" },
    ],
    items: [
      { id: "item-1", name: "Mléko", resolved: false },
      { id: "item-2", name: "Chléb", resolved: false },
      { id: "item-3", name: "Máslo", resolved: true },
    ],
  },

  "list-2": {
    id: "list-2",
    title: "Party nákup",
    ownerId: "user-2",
    members: [
      { id: "user-2", name: "Pavel", role: "owner" },
      { id: "user-4", name: "Karel", role: "member" },
    ],
    items: [
      { id: "x1", name: "Rum", resolved: false },
      { id: "x2", name: "Limetky", resolved: false },
      { id: "x3", name: "Led", resolved: true },
    ],
  },

  "list-3": {
    id: "list-3",
    title: "Starý seznam (archivovaný)",
    ownerId: "user-1",
    members: [
      { id: "user-1", name: "Jan", role: "owner" },
      { id: "user-2", name: "Eva", role: "member" },
    ],
    items: [{ id: "z1", name: "Staré zásoby", resolved: true }],
  },
};

export default function ListDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // vždycky vezmeme nějaký list – když není, fallback na list-1
  const INITIAL_LIST = LISTS_DB[id] || LISTS_DB["list-1"];

  const [title, setTitle] = useState(INITIAL_LIST.title);
  const [members, setMembers] = useState(INITIAL_LIST.members);
  const [items, setItems] = useState(INITIAL_LIST.items);
  const [showResolved, setShowResolved] = useState(false);

  const isOwner = CURRENT_USER_ID === INITIAL_LIST.ownerId;
  const currentUser = members.find((m) => m.id === CURRENT_USER_ID);

  // ---- název seznamu (jen owner) ----
  const handleRename = (newTitle) => {
    if (!isOwner) return;
    setTitle(newTitle);
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
    if (memberId === INITIAL_LIST.ownerId) {
      alert("Vlastníka nelze odebrat.");
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleLeave = () => {
    if (!currentUser) return;
    if (currentUser.id === INITIAL_LIST.ownerId) {
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
};
