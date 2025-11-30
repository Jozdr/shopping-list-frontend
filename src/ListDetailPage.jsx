import React, { useState } from "react";
import ListHeader from "./components/ListHeader";
import MembersSection from "./components/MembersSection";
import ItemsSection from "./components/ItemsSection";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const CURRENT_USER_ID = "user-2";

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
      { id: "user-5", name: "Karel", role: "member" },
    ],
    items: [
      { id: "x1", name: "Rum", resolved: false },
      { id: "x2", name: "Limetky", resolved: false },
    ],
  },
};

export default function ListDetailPage() {
  const { id } = useParams();            // ← získáme id z URL
  const INITIAL_LIST = LISTS_DB[id];     // ← vybereme správný seznam

  const [title, setTitle] = useState(INITIAL_LIST.title);
  const [members, setMembers] = useState(INITIAL_LIST.members);
  const [items, setItems] = useState(INITIAL_LIST.items);
  const [showResolved, setShowResolved] = useState(false);

  const navigate = useNavigate();

  const isOwner = CURRENT_USER_ID === INITIAL_LIST.ownerId;
  const currentUser = members.find((m) => m.id === CURRENT_USER_ID);

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
      <div style={styles.layout}>
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
    backgroundColor: "#f5f5f7",
    minHeight: "100vh",
    padding: "24px",
  },
  layout: {
    maxWidth: "960px",
    margin: "0 auto",
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "16px",
    marginTop: "16px",
  },
};
